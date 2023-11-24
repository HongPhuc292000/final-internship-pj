import { PartialType } from '@nestjs/swagger';
import { CreateAtributeDto } from './createAtribute.dto';

export class UpdateAtributeDto extends PartialType(CreateAtributeDto) {}
