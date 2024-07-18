import { Inject, Injectable } from '@nestjs/common';
import { AppConstants } from 'src/core/constants/app.constants';
import { Contact } from 'src/schema/contact.schema';

@Injectable()
export class ContactDAO {
  constructor(
    @Inject(AppConstants.CONTACT)
    private readonly contactModel: typeof Contact,
  ) {}

  async createContact(userContact: Partial<Contact>): Promise<Contact> {
    if (!userContact) {
      return;
    }
    return this.contactModel.create<Contact>(userContact);
  }

  async findContactByEmail(email: string): Promise<Contact[]> {
    if (!email) {
      return;
    }
    return this.contactModel.findAll<Contact>({
      where: { email },
      order: [['id', 'ASC']],
    });
  }

  async findContactByPhone(phoneNumber: string): Promise<Contact[]> {
    if (!phoneNumber) {
      return;
    }
    return this.contactModel.findAll<Contact>({
      where: { phoneNumber },
      order: [['id', 'ASC']],
    });
  }

  async findContactByPhoneAndEmail(
    email: string,
    phoneNumber: string,
  ): Promise<Contact | null> {
    if (!email || !phoneNumber) {
      return;
    }
    return this.contactModel.findOne({
      where: {
        email,
        phoneNumber,
      },
    });
  }

  async identifyContact(
    userContact: Partial<Contact>,
  ): Promise<Contact | null> {
    const { email, phoneNumber } = userContact;

    if (!email || !phoneNumber) {
      throw new Error(
        'Email and phone number must be provided for identification.',
      );
    }

    let existingContact = await this.findContactByPhoneAndEmail(
      email,
      phoneNumber,
    );

    if (existingContact) {
      return existingContact;
    }

    const emailContacts = await this.findContactByEmail(email);
    const phoneContacts = await this.findContactByPhone(phoneNumber);

    if (emailContacts.length > 0) {
      const linkedId = emailContacts[0].id;
      const newContact = { ...userContact, linkedId };
      return await this.createContact(newContact);
    }

    if (phoneContacts.length > 0) {
      const linkedId = phoneContacts[0].id;
      const newContact = { ...userContact, linkedId };
      return await this.createContact(newContact);
    }

    return await this.createContact(userContact);
  }
}
