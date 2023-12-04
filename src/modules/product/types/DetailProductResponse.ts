import { Category } from 'src/modules/category/entities/category.entity';
import { Product } from '../entities/product.entity';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { VariantAtribute } from 'src/modules/variant-atribute/entities/variant-atribute.entity';
import { Atribute } from 'src/modules/atribute/entities/atribute.entity';
import { AtributeOption } from 'src/modules/atribute-option/entities/atribute-option.entity';

export class ResponseDetailProductVariantAtribute extends VariantAtribute {
  @Exclude()
  atribute: Atribute;

  @Exclude()
  atributeOption: AtributeOption;

  @Expose()
  @Transform(({ value, key, obj, type }) => ({
    id: obj.atribute.id,
    name: obj.atribute.name,
  }))
  atributeId: string;

  @Expose()
  @Transform(({ value, key, obj, type }) => ({
    id: obj.atributeOption.id,
    name: obj.atributeOption.value,
  }))
  atributeOptionId: string;
}

export class ResponseDetailVariant extends Variant {
  @Exclude()
  image: ImageLink;

  @Expose()
  @Transform(({ value, key, obj, type }) => obj.image.imageUrl)
  imageUrl: string;

  @Expose()
  @Type(() => ResponseDetailProductVariantAtribute)
  variantAtributes: ResponseDetailProductVariantAtribute[];
}

export class ResponseDetailProduct extends Product {
  @Exclude()
  category: Category;

  @Exclude()
  imageLinks: ImageLink[];

  @Expose()
  @Transform(({ value, key, obj, type }) =>
    obj.imageLinks.map((link) => link.imageUrl),
  )
  imageUrls: string[];

  @Expose()
  @Transform(({ value, key, obj, type }) => obj.category.id)
  categoryId: string;

  @Exclude()
  atributes: Atribute[];

  @Expose()
  @Transform(({ value, key, obj, type }) => [
    ...obj.atributes.map((atribute) => atribute.id),
  ])
  atributeIds: string[];

  @Expose()
  @Type(() => ResponseDetailVariant)
  productVariants: ResponseDetailVariant[];
}
