import { PartialType } from '@nestjs/swagger';
import { SetVariantDto } from './createVariantAtribute.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateSetVariantDto extends PartialType(SetVariantDto) {
  @IsOptional()
  @IsUUID()
  id: string;
}
