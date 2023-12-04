import { Expose, Type } from 'class-transformer';
import { Atribute } from 'src/modules/atribute/entities/atribute.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { ImageLink } from 'src/modules/image-link/entities/image-link.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { CustomBaseEntityWithDetete } from 'src/utils/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @ManyToMany((type) => Atribute, { cascade: ['insert', 'update'] })
  @JoinTable({
    name: 'product_atribute',
    joinColumn: {
      name: 'product',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'atribute',
      referencedColumnName: 'id',
    },
  })
  atributes: Atribute[];

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
