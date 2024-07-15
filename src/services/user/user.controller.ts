import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/identify')
  async getContact(@Body() data: ContactDto): Promise<any> {
    let getContactResponse = this.userService.getContact(data);
    return getContactResponse;
  }
}
