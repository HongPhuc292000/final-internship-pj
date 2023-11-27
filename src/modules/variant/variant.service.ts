import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { Repository } from 'typeorm';
import { AddVariantDto } from './dto/createVariant.dto';
import { Variant } from './entities/variant.entity';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
  ) {
    super(variantRepository);
  }

  async addNewVariant(addNewVariantDto: AddVariantDto) {
    const { productId, ...rest } = addNewVariantDto;
    return await this.addNewData({ product: { id: productId }, ...rest });
  }
}
