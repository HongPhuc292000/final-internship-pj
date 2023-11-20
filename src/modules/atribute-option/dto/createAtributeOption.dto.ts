import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

// export class CreateAtributeOptionDto {
//   @IsNotEmpty()
//   @MaxLength(20)
//   value: string;
// }

export class CreateMultipleAtributeOptionDto {
  @IsNotEmpty()
  @IsUUID()
  atributeId: string;

  @IsNotEmpty()
  data: string[];
}
