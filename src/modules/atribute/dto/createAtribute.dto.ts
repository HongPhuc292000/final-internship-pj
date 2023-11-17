import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAtributeDto {
  @IsNotEmpty()
  @MaxLength(20)
  name: string;
}
