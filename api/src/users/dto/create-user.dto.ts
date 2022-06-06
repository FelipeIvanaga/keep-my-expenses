import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 32)
  password: string;
}
