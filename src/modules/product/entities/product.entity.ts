import { Category } from 'src/modules/category/entities/category.entity';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { ProductVariant } from 'src/modules/product-variant/entities/product-variant.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Product extends CustomBaseEntity {
  @Column({ length: 200, nullable: false })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  sold: number;

  @Column({ length: 2000, nullable: false })
  description: string;

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

  @OneToMany(() => ImageLink, (imageLink) => imageLink.product)
  imageLinks: ImageLink[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
