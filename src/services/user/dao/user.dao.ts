import { Inject, Injectable } from '@nestjs/common';
import { AppConstants } from 'src/core/constants/app.constants';
import { IUserResponse } from 'src/core/interfaces/contact.interface';
import { Contact } from 'src/schema/contact.schema';

@Injectable()
export class ContactDAO {
  constructor(
    @Inject(AppConstants.CONTACT)
    private readonly contactModel: typeof Contact,
  ) {}

  //Handler to create a new user
  async createContact(userContact: Partial<Contact>): Promise<Contact> {
    if (!userContact) {
      return;
    }
    return this.contactModel.create<Contact>(userContact);
  }

  //Handler to find contact by email
  async findContactByEmail(email: string): Promise<Contact[]> {
    if (!email) {
      return;
    }
    return this.contactModel.findAll<Contact>({
      where: { email },
      order: [['id', 'ASC']],
    });
  }

  // Handler to find contact by phone number
  async findContactByPhone(phoneNumber: string): Promise<Contact[]> {
    if (!phoneNumber) {
      return;
    }
    return this.contactModel.findAll<Contact>({
      where: { phoneNumber },
      order: [['id', 'ASC']],
    });
  }

  //Find Contact By Email and Phone
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

  //Helper function to sort a array of object
  async sortArrayOfObject(array: Contact[]) {
    let sortedArr = array.sort((index, secIndex) => index.id - secIndex.id);
    return sortedArr;
  }

  //Handler to create a new secondary contact
  async createSecondaryContact(
    primaryContact: Contact[],
    secondaryContact: Partial<Contact>,
  ): Promise<Contact | null> {
    let sortedArr = await this.sortArrayOfObject(primaryContact);
    let linkedId: number = sortedArr[0].id;
    let linkPrecedence: any = 'secondary';
    const newContact = { ...secondaryContact, linkedId, linkPrecedence };
    return await this.createContact(newContact);
  }

  //Hanlder update detail of a given contact
  async updateContactDetail(
    primaryConatctId: number,
    secondaryContactId: number,
  ): Promise<void> {
    await this.contactModel.update<Contact>(
      {
        linkedId: primaryConatctId,
        linkPrecedence: 'secondary',
      },
      {
        where: {
          id: secondaryContactId,
        },
      },
    );
    return;
  }

  //Handler to update secondary contact details using primary contact details
  async updatePrimaryContactToSecondary(
    primaryContact: Contact,
    secondaryEmailContact: Contact[],
    secondaryPhoneContact: Contact[],
  ): Promise<Contact | null> {
    const primaryConatctId = primaryContact.id;
    secondaryEmailContact.map(async (email) => {
      if (email.id != primaryContact.id) {
        await this.updateContactDetail(primaryConatctId, email.id);
      }
    });
    secondaryPhoneContact.map(async (phone) => {
      if (phone.id != primaryContact.id) {
        await this.updateContactDetail(primaryConatctId, phone.id);
      }
    });
    return;
  }

  // To get contact by Id
  async getContactById(id: number): Promise<Contact | null> {
    let response = await this.contactModel.findOne<Contact>({ where: { id } });
    return response.dataValues;
  }

  //Helper function to format the respons in required format
  async responseHandler(
    primaryContact: Contact,
    secondaryContact?: Contact,
  ): Promise<IUserResponse | null> {
    let responseObj: IUserResponse = {
      primaryContactId: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };

    if (!secondaryContact && primaryContact.linkPrecedence == 'primary') {
      responseObj.primaryContactId = primaryContact.id;
      responseObj.emails = [primaryContact.email];
      responseObj.phoneNumbers = [primaryContact.phoneNumber];
    } else if (primaryContact && primaryContact.linkPrecedence == 'secondary') {
      let fetchLinkedContact = await this.getContactById(
        primaryContact.linkedId,
      );
      let linkEmail = [];
      let linkPhone = [];
      linkEmail?.push(fetchLinkedContact.email);
      if (primaryContact?.email != fetchLinkedContact?.email) {
        linkEmail.push(primaryContact?.email);
      }
      linkPhone?.push(fetchLinkedContact?.phoneNumber);
      if (primaryContact?.phoneNumber != fetchLinkedContact?.phoneNumber) {
        linkPhone?.push(primaryContact?.phoneNumber);
      }
      responseObj.primaryContactId = fetchLinkedContact.id;
      responseObj.emails = linkEmail;
      responseObj.phoneNumbers = linkPhone;
      responseObj.secondaryContactIds = [primaryContact.id];
    } else if (secondaryContact && primaryContact) {
      responseObj.primaryContactId = primaryContact.id;
      if (secondaryContact?.email != primaryContact?.email) {
        let email = [];
        email.push(secondaryContact?.email);
        email.push(primaryContact?.email);
        responseObj.emails = email;
      } else {
        responseObj.emails = [primaryContact.email];
      }
      if (secondaryContact?.phoneNumber != primaryContact?.phoneNumber) {
        let phoneNumber = [];
        phoneNumber.push(secondaryContact?.phoneNumber);
        phoneNumber.push(primaryContact?.phoneNumber);
        responseObj.phoneNumbers = phoneNumber;
      } else {
        responseObj.phoneNumbers = [primaryContact.phoneNumber];
      }
      responseObj.secondaryContactIds = [secondaryContact.id];
    }
    return responseObj;
  }

  //Main Handler to indentify the contact details and orchestrate the updation flow of contacts
  async identifyContact(
    userContact: Partial<Contact>,
  ): Promise<IUserResponse | any> {
    let { email, phoneNumber } = userContact;
    email = email ? email : '';
    phoneNumber = phoneNumber ? phoneNumber : '';

    if (!email && !phoneNumber) {
      throw new Error(
        'Either Email or phone number must be provided for identification.',
      );
    }

    let existingContact = await this.findContactByPhoneAndEmail(
      email,
      phoneNumber,
    );

    if (existingContact) {
      console.log('Existing Contact');
      let response = existingContact.dataValues;
      return await this.responseHandler(response);
    }

    let emailContacts = await this.findContactByEmail(email);
    let phoneContacts = await this.findContactByPhone(phoneNumber);

    emailContacts = emailContacts
      ? emailContacts.map((data) => data.dataValues)
      : [];
    phoneContacts = phoneContacts
      ? phoneContacts.map((data) => data.dataValues)
      : [];

    if (emailContacts.length == 0 && phoneContacts.length == 0) {
      console.log('New contact');
      let response = await this.createContact(userContact);
      return await this.responseHandler(response);
    }

    if (emailContacts.length > 0 && phoneContacts.length > 0) {
      console.log('Both contact exists and need update of linked id');
      let sortedEmailContacts = await this.sortArrayOfObject(emailContacts);
      let sortedPhoneContacts = await this.sortArrayOfObject(phoneContacts);
      let primaryContact =
        sortedEmailContacts[0].id < sortedPhoneContacts[0].id
          ? sortedEmailContacts[0] &&
            sortedEmailContacts[0].linkPrecedence === 'primary'
            ? sortedEmailContacts[0]
            : sortedPhoneContacts[0]
          : sortedPhoneContacts[0] &&
              sortedPhoneContacts[0].linkPrecedence === 'primary'
            ? sortedPhoneContacts[0]
            : sortedEmailContacts[0];
      const response = await this.updatePrimaryContactToSecondary(
        primaryContact,
        sortedEmailContacts,
        sortedPhoneContacts,
      );
      return response;
    }

    if (
      (emailContacts.length > 0 && phoneContacts.length < 1) ||
      (emailContacts.length < 1 && phoneContacts.length > 0)
    ) {
      console.log('New secondary conatct with primary available');
      const primaryContact =
        emailContacts.length > 0 ? emailContacts : phoneContacts;
      const response = await this.createSecondaryContact(
        primaryContact,
        userContact,
      );
      console.log('Primary contact', primaryContact);
      return await this.responseHandler(primaryContact[0], response);
    }
  }
}
