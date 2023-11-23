import { Exclude, Expose, Type } from 'class-transformer';
import { Category } from 'src/modules/category/entities/category.entity';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import {
  CustomBaseEntity,
  CustomBaseEntityWithDetete,
} from 'src/utils/base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product extends CustomBaseEntityWithDetete {
  @Expose()
  @Column({ length: 200, nullable: false })
  name: string;

  @Expose()
  @Column({ type: 'int', default: 0 })
  sold: number;

  @Expose()
  @Column({ length: 2000, nullable: false })
  description: string;

  @OneToMany(() => Variant, (variant) => variant.product, {
    cascade: ['insert', 'update'],
  })
  @Type(() => Variant)
  productVariants: Variant[];

  @OneToMany(() => ImageLink, (imageLink) => imageLink.product, {
    cascade: ['insert', 'update'],
  })
  @Type(() => ImageLink)
  imageLinks: ImageLink[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  @Type(() => Category)
  category: Category;
}
