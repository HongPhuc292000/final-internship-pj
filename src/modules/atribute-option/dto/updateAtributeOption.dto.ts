import { IsOptional } from 'class-validator';

export class UpdateAtributeOptionDto {
  @IsOptional()
  value: string;
}
