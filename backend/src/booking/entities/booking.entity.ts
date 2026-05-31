import { Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Entity} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Animal } from "src/animals/entities/animal.entity";
export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}


@Entity('bookings')


export class Booking {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({ type : 'date' })
    startDate : Date ; 

    @Column({ type : 'date' })
    endDate : Date ; 

    @Column({type : 'enum' , enum : BookingStatus , default : BookingStatus.PENDING})
    status : BookingStatus ; 

    @Column({type : 'decimal' , precision : 10 , scale : 2 , nullable : true})
    totalPrice : number ; 

    @Column({nullable : true})
    message : string ;

    @ManyToOne(()=> User )
    @JoinColumn({name : 'ownerId'})
    owner : User ;
    
    @Column()
    ownerId : number ; 


    @ManyToOne(()=> User )
    @JoinColumn({name : 'sitterId'})
    sitter : User ;

    @Column()
    sitterId : number ;

    @ManyToOne( ()=> Animal)
    @JoinColumn({name : "animalId"})
    animal : Animal ;
    @Column()
    animalId : number ;
}