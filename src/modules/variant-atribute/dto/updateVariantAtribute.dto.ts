import { PartialType } from '@nestjs/swagger';
import { SetVariantDto } from './createVariantAtribute.dto';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateSetVariantDto extends PartialType(SetVariantDto) {
  @IsOptional()
  @IsUUID()
  id: string;
}

export class UpdateVariantAtributeDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  variantId: string;

  @IsOptional()
  @IsUUID()
  atributeId: string;

  @IsOptional()
  @IsUUID()
  atributeOptionId: string;
}
