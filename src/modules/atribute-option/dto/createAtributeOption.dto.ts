import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMultipleAtributeOptionDto {
  @IsNotEmpty()
  @IsUUID()
  atributeId: string;

  @IsNotEmpty()
  data: string[];
}
