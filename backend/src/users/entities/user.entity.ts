import { Exclude } from 'class-transformer';
import {Column , Entity , OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { SitterProfile } from '../../sitter-profile/entities/sitter-profile.entity';
export enum UserRole {
    OWNER = 'owner', 
    SITTER = 'sitter'
}

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    firstName :string; 

    @Column()
    lastName : string;

    @Column({unique : true})
    email : string; 
    
    @Exclude()
    @Column()
    password : string ; 

    @Column({type : 'enum' , enum : UserRole , default: UserRole.OWNER})
    role : UserRole; 

    @Column({nullable : true})
    city : string ; 

    @Column( { default : false })
    isVerified : boolean ; 

    @OneToMany(()=> Animal , animal => animal.owner)
    animals : Animal[] ;

    @OneToOne(() => SitterProfile, sitterProfile => sitterProfile.user)
    sitterProfile : SitterProfile ;

}