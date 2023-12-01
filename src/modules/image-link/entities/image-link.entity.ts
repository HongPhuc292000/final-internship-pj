import { Product } from 'src/modules/product/entities/product.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('image_link')
export class ImageLink extends CustomBaseEntity {
  @Column({ name: 'link', length: 30, nullable: false })
  imageUrl: string;

  @ManyToOne(() => Product, (product) => product.imageLinks, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(() => Variant, (variant) => variant.image)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;
}
