import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

class AmountValidation {
  //decoradores para validar informacion

  @IsString()
  description: string;

  @IsNumber()
  amount: Number;
}
export default new AmountValidation();
