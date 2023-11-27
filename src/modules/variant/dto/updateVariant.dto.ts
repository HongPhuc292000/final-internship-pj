import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVariantDto } from './createVariant.dto';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from 'src/decorators/validation/isNonPrimitiveArray.decorator';
import { UpdateSetVariantDto } from 'src/modules/variant-atribute/dto/updateVariantAtribute.dto';
import { Type } from 'class-transformer';

export class UpdateVariantDto extends PartialType(
  OmitType(CreateVariantDto, ['set']),
) {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpdateSetVariantDto)
  set: UpdateSetVariantDto[];
}
