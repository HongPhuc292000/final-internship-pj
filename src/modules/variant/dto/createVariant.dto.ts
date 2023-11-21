import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IsNonPrimitiveArray } from 'src/decorators/validation/isNonPrimitiveArray.decorator';
import { SetVariantDto } from 'src/modules/variant-atribute/dto/createVariantAtribute.dto';

export class CreateVariantDto {
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => SetVariantDto)
  set: SetVariantDto[];

  @IsNotEmpty()
  @IsInt()
  initialPrice: number;

  @IsOptional()
  @IsInt()
  reducedPrice: number;

  @IsNotEmpty()
  @IsInt()
  totalInstock: number;
}
