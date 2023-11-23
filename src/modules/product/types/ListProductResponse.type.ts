import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Product } from '../entities/product.entity';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { ResponseDetailVariant } from './DetailProductResponse';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import {
  getMaxArrayNumber,
  getMinArrayNumber,
  getArrayPrice,
} from 'src/utils/handleArray';

export class ListProductResponse extends Product {
  @Exclude()
  imageLinks: ImageLink[];

  @Expose()
  @Transform(({ value, key, obj, type }) => {
    const imageUrls = obj.imageLinks.map((link: ImageLink) => link.imageUrl);
    return imageUrls[0];
  })
  imageUrls: string;

  @Exclude()
  productVariants: Variant[];

  @Expose()
  @Transform(({ value, key, obj, type }) => {
    const productPrices: number[] = getArrayPrice(
      obj.productVariants,
      'initialPrice',
      'reducedPrice',
    );

    return getMinArrayNumber(productPrices);
  })
  minPrice: number;

  @Expose()
  @Transform(({ value, key, obj, type }) => {
    const productPrices: number[] = getArrayPrice(
      obj.productVariants,
      'initialPrice',
      'reducedPrice',
    );

    return getMaxArrayNumber(productPrices);
  })
  maxPrice: number;
}
