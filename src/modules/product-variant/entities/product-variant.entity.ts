import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('product_variant')
export class ProductVariant extends CustomBaseEntity {
  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Variant)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @Column({ name: 'total_instock', type: 'int', nullable: false, default: 0 })
  totalInstock: number;

  @Column({ name: 'initial_price', type: 'int', nullable: false })
  initialPrice: number;

  @OneToOne(() => ImageLink)
  @JoinColumn({ name: 'image_id' })
  image: ImageLink;
}
