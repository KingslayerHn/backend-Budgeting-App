import { IsEmail, MinLength, IsString } from 'class-validator';

class UserValidation {
    //decoradores para validar informacion

    @IsEmail()
    @IsString()
    email: string;

    @MinLength(8)
    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    genre: string;
}
export default new UserValidation();
