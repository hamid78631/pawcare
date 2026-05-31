import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum acceptedAnimalTypes {
  DOG = 'dog',
  CAT = 'cat',
  OTHER = 'other',
}

@Entity('sitter_profiles')
export class SitterProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bio: string;

  @Column()
  hourlyRate: number;

  @Column({ type: 'simple-array', nullable: true })
  acceptedAnimalTypes: acceptedAnimalTypes[];

  @Column({ nullable: true })
  city: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToOne(() => User, user => user.sitterProfile, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true })
  userId: number;
}
