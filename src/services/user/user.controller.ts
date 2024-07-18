import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/identify')
  async getContact(
    @Body() contactDto: ContactDto,
    @Res() response,
  ): Promise<any> {
    const { phoneNumber, email } = contactDto;
    if (!phoneNumber && !email) {
      return response.status(500).json({
        statusCode: 500,
        message: 'Either phonenumber or email should be given',
      });
    }
    let getContactResponse = await this.userService.getContact(contactDto);
    return response.status(200).json(getContactResponse);
  }
}
