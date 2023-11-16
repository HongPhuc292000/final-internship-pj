import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Atribute extends CustomBaseEntity {
  @Column({ length: 20, nullable: false })
  name: string;
}
