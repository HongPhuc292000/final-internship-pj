import { Controller, Query, Get } from '@nestjs/common';
import { VariantService } from './variant.service';
import { IVariantQuery } from 'src/types/Query';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  findAllVariant(@Query() query: IVariantQuery) {
    return this.variantService.getAllVariant(query);
  }
}
