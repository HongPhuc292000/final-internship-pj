import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetVariantDto {
  @IsNotEmpty()
  @IsUUID()
  atribute: string;

  @IsNotEmpty()
  @IsUUID()
  atributeOption: string;
}
