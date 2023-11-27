import { IsNotEmpty, IsUUID } from 'class-validator';

export class SetVariantDto {
  @IsNotEmpty()
  @IsUUID()
  atribute: string;

  @IsNotEmpty()
  @IsUUID()
  atributeOption: string;
}

export class CreateVariantAtributeDto {
  @IsNotEmpty()
  @IsUUID()
  variantId: string;

  @IsNotEmpty()
  @IsUUID()
  atributeId: string;

  @IsNotEmpty()
  @IsUUID()
  atributeOptionId: string;
}
