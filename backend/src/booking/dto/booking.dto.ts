import { IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  sitterId: number;

  @IsInt()
  animalId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  message?: string;
}
