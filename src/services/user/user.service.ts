import { Injectable, Logger } from '@nestjs/common';
import { AppConstants } from 'src/core/constants/app.constants';
import { ContactDAO } from './dao/user.dao';
import { IUserContact } from 'src/core/interfaces/contact.interface';
import { ContactDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(AppConstants.USER_SERVICE);
  constructor(private readonly contactDAO: ContactDAO) {}

  getContact = async (userConatct: ContactDto): Promise<IUserContact> => {
    this.logger.log('Invoke service get contact');
    let getContactResponse: any;
    getContactResponse = await this.contactDAO.createContact(userConatct);
    this.logger.log('Create user response', getContactResponse);
    return getContactResponse;
  };
}
