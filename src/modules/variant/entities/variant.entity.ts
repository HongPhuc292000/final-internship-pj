import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { VariantAtribute } from 'src/modules/variant-atribute/entities/variant-atribute.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Variant extends CustomBaseEntity {
  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'total_instock', type: 'int', nullable: false, default: 0 })
  totalInstock: number;

  @Column({ name: 'initial_price', type: 'int', nullable: false })
  initialPrice: number;

  @Column({ name: 'reduced_price', type: 'int' })
  reducedPrice: number;

  @OneToOne(() => ImageLink, { cascade: ['insert'] })
  @JoinColumn({ name: 'image_id' })
  image: ImageLink;

  @OneToMany(
    () => VariantAtribute,
    (variantAtribute) => variantAtribute.variant,
    { cascade: ['insert'] },
  )
  variantAtributes: VariantAtribute[];
}
