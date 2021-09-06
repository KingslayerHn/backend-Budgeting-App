import { IsEmail, IsString, MinLength } from 'class-validator';

class AuthValidation {
    //decoradores para validar informacion

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}
export default new AuthValidation();
