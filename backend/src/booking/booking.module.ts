import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { SitterProfile } from '../sitter-profile/entities/sitter-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, SitterProfile])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}