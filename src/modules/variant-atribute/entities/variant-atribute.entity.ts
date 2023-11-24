import { AtributeOption } from 'src/modules/atribute-option/entities/atribute-option.entity';
import { Atribute } from 'src/modules/atribute/entities/atribute.entity';
import { Variant } from 'src/modules/variant/entities/variant.entity';
import { CustomBaseEntity } from 'src/utils/base.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('variant_atribute')
export class VariantAtribute extends CustomBaseEntity {
  @ManyToOne(() => Variant, (variant) => variant.variantAtributes)
  @JoinColumn({ name: 'variant_id' })
  variant: Variant;

  @ManyToOne(() => Atribute, (atribute) => atribute.variantAtributes, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'atribute_id' })
  atribute: Atribute;

  @ManyToOne(() => AtributeOption, { cascade: ['insert'] })
  @JoinColumn({ name: 'atribute_option_id' })
  atributeOption: AtributeOption;
}
