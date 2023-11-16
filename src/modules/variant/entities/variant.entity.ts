import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Variant extends CustomBaseEntity {
  @Column({ length: 100, nullable: false })
  name: string;
}
