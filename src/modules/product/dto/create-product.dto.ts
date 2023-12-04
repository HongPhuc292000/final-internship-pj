import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsNonPrimitiveArray } from 'src/decorators/validation/isNonPrimitiveArray.decorator';
import { CreateVariantDto } from 'src/modules/variant/dto/createVariant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  atributeIds: string[];

  @IsNotEmpty()
  @IsString({ each: true })
  imageUrls: string[];

  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @IsNotEmpty()
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
