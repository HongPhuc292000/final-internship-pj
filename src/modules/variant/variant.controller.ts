import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { VariantService } from './variant.service';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.variantService.removeVariant(id);
  }
}
