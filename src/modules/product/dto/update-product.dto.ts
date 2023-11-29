import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from 'src/decorators/validation/isNonPrimitiveArray.decorator';
import { Type } from 'class-transformer';
import { UpdateVariantDto } from 'src/modules/variant/dto/updateVariant.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['variants']),
) {
  @IsOptional()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => UpdateVariantDto)
  variants: UpdateVariantDto[];
}
