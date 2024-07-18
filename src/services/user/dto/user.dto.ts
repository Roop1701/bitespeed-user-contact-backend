import { IsOptional, IsString } from 'class-validator';

export class ContactDto {
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
