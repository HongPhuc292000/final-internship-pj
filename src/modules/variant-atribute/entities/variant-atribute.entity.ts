import { AtributeOption } from 'src/modules/atribute-option/entities/atribute-option.entity';
import { Atribute } from 'src/modules/atribute/entities/atribute.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('variant_atribute')
export class VariantAtribute extends CustomBaseEntity {
  @ManyToOne(() => Variant, (variant) => variant.variantAtributes)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @ManyToOne(() => Atribute)
  @JoinColumn({ name: 'atribute_id' })
  atribute: Atribute;

  @ManyToMany(() => AtributeOption)
  @JoinTable({
    name: 'variant_atribute_option',
    joinColumn: {
      name: 'variant_atribute_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'atribute_option_id',
      referencedColumnName: 'id',
    },
  })
  atributeOptions: AtributeOption[];
}
