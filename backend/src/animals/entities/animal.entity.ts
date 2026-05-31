import {Entity , PrimaryGeneratedColumn , Column, ManyToOne} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AnimalType {
    DOG = 'dog',
    CAT = 'cat',
    OTHER = 'other'
}
@Entity('animals')
export class Animal{
    @PrimaryGeneratedColumn()
    id : number ; 

    @Column()
    name : string ; 

    @Column({ type: 'enum', enum: AnimalType, default: AnimalType.DOG })
    species : AnimalType ;
    
    @Column({ nullable: true })
  breed: string;

    @Column()
    age : number ;

    @Column({nullable : true})
    description : string ; 

    @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
    owner: User;

    @Column()
    ownerId : number; 
}