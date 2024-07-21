import { AppConstants } from 'src/core/constants/app.constants';
import { Contact } from 'src/schema/contact.schema';

export const userProviders = [
  {
    provide: AppConstants.CONTACT,
    useValue: Contact,
  },
];
