import { Expose } from 'class-transformer';
import { Product } from 'src/modules/product/entities/product.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, ManyToOne, OneToMany, Entity, JoinColumn } from 'typeorm';

@Entity()
export class Category extends CustomBaseEntity {
  @Expose()
  @Column({ length: 30, nullable: false, unique: true })
  name: string;

  @OneToMany(() => Category, (category) => category.parent)
  childs: Category[];

  @Expose()
  @ManyToOne(() => Category, (category) => category.childs)
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
