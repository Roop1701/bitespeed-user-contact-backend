import { Injectable, Logger } from '@nestjs/common';
import { AppConstants } from 'src/core/constants/app.constants';
import { ContactDAO } from './dao/user.dao';
import { IUserResponse } from 'src/core/interfaces/contact.interface';
import { ContactDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(AppConstants.USER_SERVICE);
  constructor(private readonly contactDAO: ContactDAO) {}

  getContact = async (userConatct: ContactDto): Promise<IUserResponse> => {
    this.logger.log('Invoke service get contact');
    let getContactResponse: any;
    getContactResponse = await this.contactDAO.identifyContact(userConatct);
    this.logger.log('Fetch user response', JSON.stringify(getContactResponse));
    return getContactResponse;
  };
}
