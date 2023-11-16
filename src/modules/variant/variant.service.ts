import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './entities/variant.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services/base-crud.service';
import { CreateCategoryDto } from './dto/createVariant.dto';
import { ResponseData } from 'src/types';

@Injectable()
export class VariantService extends BaseService<Variant> {
  constructor(
    @InjectRepository(Variant) private variantRepository: Repository<Variant>,
  ) {
    super(variantRepository);
  }

  async addNewVariant(createCategoryDto: CreateCategoryDto): Promise<Variant> {
    const newVariant = this.variantRepository.create(createCategoryDto);
    return await this.variantRepository.save(newVariant);
  }
}
