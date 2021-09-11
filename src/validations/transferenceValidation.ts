import { IsString, MinLength, IsNumber } from 'class-validator';

class TransferenceValidation {
  //decoradores para validar informacion

  @IsString()
  description: string;

  @IsNumber()
  senderAmount: Number;
}
export default new TransferenceValidation();
