import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { acceptedAnimalTypes } from '../entities/sitter-profile.entity';

export class CreateSitterProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(acceptedAnimalTypes, { each: true })
  acceptedAnimalTypes?: acceptedAnimalTypes[];

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
