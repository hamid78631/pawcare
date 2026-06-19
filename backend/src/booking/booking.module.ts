import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { SitterProfile } from '../sitter-profile/entities/sitter-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, SitterProfile, User]), EmailModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports : [BookingService]
})
export class BookingModule {}
