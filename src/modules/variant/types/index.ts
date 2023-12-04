import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Variant } from '../entities/variant.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { ResponseDetailProductVariantAtribute } from 'src/modules/product/types/DetailProductResponse';

export interface SetAtributeOptionToUpdateVariant {
  id?: string;
  variantId: string;
  atribute?: string;
  atributeOption?: string;
}

export interface UpdatedVariantToProduct {
  variantId: string;
  imageUrl?: string;
  set?: SetAtributeOptionToUpdateVariant[];
}

export class ListVariantResponse extends Variant {
  @Exclude()
  product: Product;

  @Expose()
  @Transform(({ value, key, obj, type }) => obj.product.id)
  productId: string;

  @Exclude()
  image: ImageLink;

  @Expose()
  @Transform(({ value, key, obj, type }) => obj.image.imageUrl)
  imageUrl: string;

  @Expose()
  @Type(() => ResponseDetailProductVariantAtribute)
  variantAtributes: ResponseDetailProductVariantAtribute[];
}
