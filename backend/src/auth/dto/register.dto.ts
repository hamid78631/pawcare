import { IsEmail, IsNotEmpty, IsEnum , IsOptional , IsString , MinLength } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {

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
    @MinLength(8)
  password : string ; 

  @IsOptional()
    @IsEnum(UserRole)
  role ?: UserRole ; 

  @IsOptional()
    @IsString()
  city : string ; 
}