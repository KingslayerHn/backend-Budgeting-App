import { IsEmail, IsString } from 'class-validator';

class AuthValidation {
  //decoradores para validar informacion

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
export default new AuthValidation();
