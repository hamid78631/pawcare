import { IsEmail , IsEnum , IsNotEmpty , IsOptional , IsString , MinLength} from "class-validator";
import {UserRole } from "../entities/user.entity";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    firstName : string ; 

    @IsNotEmpty()
    @IsString()
    lastName : string ;

    @IsNotEmpty()
    @IsEmail()
    email : string ;

    @IsNotEmpty()
    @MinLength(6)
    password : string ;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole ;

    @IsOptional()
    @IsString()
    city?: string ;
}