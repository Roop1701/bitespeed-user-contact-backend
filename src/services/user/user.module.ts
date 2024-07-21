import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { ContactDAO } from './dao/user.dao';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, ContactDAO, ...userProviders],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
