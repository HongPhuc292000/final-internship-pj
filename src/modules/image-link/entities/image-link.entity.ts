import { Product } from 'src/modules/product/entities/product.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('image_link')
export class ImageLink extends CustomBaseEntity {
  @Column({ name: 'link', length: 30, nullable: false })
  imageUrl: string;

  @ManyToOne(() => Product, (product) => product.imageLinks)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
