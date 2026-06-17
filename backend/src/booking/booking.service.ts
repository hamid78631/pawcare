import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/booking.dto';
import { SitterProfile } from '../sitter-profile/entities/sitter-profile.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../email/email.service';
import { MSG } from '../constants/messages';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(SitterProfile)
    private sitterProfileRepository: Repository<SitterProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateBookingDto, ownerId: number) {
    const sitterProfile = await this.sitterProfileRepository.findOne({
      where: { userId: dto.sitterId },
      relations: ['user'],
    });
    if (!sitterProfile) throw new NotFoundException(MSG.SITTER_PROFILE_NOT_FOUND);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) throw new BadRequestException(MSG.BOOKING_DATE_INVALID);

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * Number(sitterProfile.hourlyRate);

    const booking = this.bookingRepository.create({ ...dto, ownerId, totalPrice });
    const saved = await this.bookingRepository.save(booking);

    const owner = await this.userRepository.findOneBy({ id: ownerId });
    if (owner && sitterProfile.user) {
      await this.emailService.sendBookingCreated(
        sitterProfile.user.email,
        `${sitterProfile.user.firstName} ${sitterProfile.user.lastName}`,
        `${owner.firstName} ${owner.lastName}`,
        dto.startDate,
        dto.endDate,
      );
    }

    return saved;
  }

  findAll() {
    return this.bookingRepository.find();
  }

  findByOwner(ownerId: number) {
    return this.bookingRepository.find({
      where: { ownerId },
      relations: ['animal', 'sitter'],
      order: { startDate: 'DESC' },
    });
  }

  findBySitter(sitterId: number) {
    return this.bookingRepository.find({
      where: { sitterId },
      relations: ['animal', 'owner'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) throw new NotFoundException(MSG.BOOKING_NOT_FOUND);
    return booking;
  }

  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['owner', 'sitter'],
    });
    if (!booking) throw new NotFoundException(MSG.BOOKING_NOT_FOUND);

    booking.status = status;
    const saved = await this.bookingRepository.save(booking);

    if ((status === BookingStatus.CONFIRMED || status === BookingStatus.CANCELLED) && booking.owner && booking.sitter) {
      await this.emailService.sendBookingStatusChanged(
        booking.owner.email,
        `${booking.owner.firstName} ${booking.owner.lastName}`,
        `${booking.sitter.firstName} ${booking.sitter.lastName}`,
        status,
        booking.startDate.toString(),
      );
    }

    return saved;
  }
}
