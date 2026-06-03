import { PartialType } from '@nestjs/mapped-types';
import { CreateSitterProfileDto } from './create-sitter-profile';

export class UpdateSitterProfileDto extends PartialType(CreateSitterProfileDto) {}
