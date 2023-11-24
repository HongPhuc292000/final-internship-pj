import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import {
  getArrayPrice,
  getMaxArrayNumber,
  getMinArrayNumber,
} from 'src/utils/handleArray';
import { Product } from '../entities/product.entity';

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
