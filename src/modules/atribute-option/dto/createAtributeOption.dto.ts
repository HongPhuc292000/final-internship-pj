import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateAtributeOptionDto {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsUUID()
  atributeId: string;
}
