import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(dto: CreateReviewDto, ownerId: number) {
    const booking = await this.bookingRepository.findOneBy({ id: dto.bookingId });
    if (!booking) {
      throw new NotFoundException(`Booking #${dto.bookingId} not found`);
    }
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('You can only review a completed booking');
    }
    const existing = await this.reviewRepository.findOneBy({ bookingId: dto.bookingId });
    if (existing) {
      throw new ConflictException('A review already exists for this booking');
    }

    const review = this.reviewRepository.create({
      ...dto,
      ownerId,
      sitterId: booking.sitterId,
    });
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find();
  }

  findBySitter(sitterId: number) {
    return this.reviewRepository.find({ where: { sitterId } });
  }
}
