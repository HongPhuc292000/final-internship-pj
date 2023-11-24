import { AtributeOption } from 'src/modules/atribute-option/entities/atribute-option.entity';
import { VariantAtribute } from 'src/modules/variant-atribute/entities/variant-atribute.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Atribute extends CustomBaseEntity {
  @Column({ length: 20, nullable: false })
  name: string;

  @OneToMany(
    () => VariantAtribute,
    (variantAtribute) => variantAtribute.atribute,
    { cascade: ['remove'] },
  )
  variantAtributes: Atribute[];

  @OneToMany(
    () => AtributeOption,
    (atributeOption) => atributeOption.atribute,
    { orphanedRowAction: 'delete' },
  )
  atributeOptions: AtributeOption[];
}
