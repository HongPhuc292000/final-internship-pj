import { Atribute } from 'src/modules/atribute/entities/atribute.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('atribute_option')
export class AtributeOption extends CustomBaseEntity {
  @Column({ length: 100, nullable: false })
  value: string;

  @ManyToOne(() => Atribute, (atribute) => atribute.atributeOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'atribute_id' })
  atribute: Atribute;
}
