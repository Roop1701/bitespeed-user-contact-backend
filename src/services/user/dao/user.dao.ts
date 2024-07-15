import { Inject } from '@nestjs/common';
import { AppConstants } from 'src/core/constants/app.constants';
import { Contact } from 'src/schema/contact.schema';

export class ContactDAO {
  constructor(
    @Inject(AppConstants.CONTACT)
    private readonly contact: typeof Contact,
  ) {}
  async createContact(userContact: Partial<Contact>): Promise<Contact> {
    return await this.contact.create<Contact>(userContact);
  }
}
