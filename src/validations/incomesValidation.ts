import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

class IncomeValidation {
  //decoradores para validar informacion

  @IsString()
  description: string;

  @IsNumber()
  amount: Number;
}
export default new IncomeValidation();
