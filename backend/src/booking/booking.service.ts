import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import { SitterProfile } from '../sitter-profile/entities/sitter-profile.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(SitterProfile)
    private sitterProfileRepository: Repository<SitterProfile>,
  ) {}

  async create(dto: CreateBookingDto, ownerId: number) {
    const sitterProfile = await this.sitterProfileRepository.findOneBy({ userId: dto.sitterId });
    if (!sitterProfile) {
      throw new NotFoundException('Sitter profile not found');
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * Number(sitterProfile.hourlyRate) * 24;

    const booking = this.bookingRepository.create({
      ...dto,
      ownerId,
      totalPrice,
    });
    return this.bookingRepository.save(booking);
  }

  findAll() {
    return this.bookingRepository.find();
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.findOne(id);
    booking.status = status;
    return this.bookingRepository.save(booking);
  }
}
