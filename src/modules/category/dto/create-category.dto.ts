import { IsNotEmpty, IsUUID, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsUUID()
  @IsOptional()
  parentId: string;
}
