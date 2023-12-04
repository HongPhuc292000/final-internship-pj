import { Expose } from 'class-transformer';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { VariantAtribute } from 'src/modules/variant-atribute/entities/variant-atribute.entity';
import { CustomBaseEntityWithDetete } from 'src/utils/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Variant extends CustomBaseEntityWithDetete {
  @ManyToOne(() => Product, (product) => product.productVariants, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Expose()
  @Column({ name: 'total_instock', type: 'int', nullable: false, default: 0 })
  totalInstock: number;

  @Expose()
  @Column({ name: 'initial_price', type: 'int', nullable: false })
  initialPrice: number;

  @Expose()
  @Column({ name: 'reduced_price', type: 'int' })
  reducedPrice: number;

  @OneToOne(() => ImageLink, (image) => image.variant, {
    cascade: ['insert', 'update'],
  })
  image: ImageLink;

  @OneToMany(
    () => VariantAtribute,
    (variantAtribute) => variantAtribute.variant,
    { cascade: ['insert', 'update', 'remove'] },
  )
  variantAtributes: VariantAtribute[];
}
