import { IsNotEmpty, IsEnum , IsOptional , IsString , Min, IsInt } from 'class-validator';
import { AnimalType } from '../entities/animal.entity';

export class CreateAnimalDto{
    @IsNotEmpty()
    @IsString()
    name : string ; 

    @IsEnum(AnimalType)
    @IsOptional()
    species : AnimalType ; 

    @IsOptional()
    @IsString()
    breed?: string 

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    age: number;

    @IsOptional()
    @IsString()
    description?: string ;
}