import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { MSG } from '../constants/messages';

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
      throw new NotFoundException(MSG.REVIEW_BOOKING_NOT_FOUND);
    }
    if (booking.status !== BookingStatus.COMPLETED && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(MSG.REVIEW_BOOKING_INVALID_STATUS);
    }
    const existing = await this.reviewRepository.findOneBy({ bookingId: dto.bookingId });
    if (existing) {
      throw new ConflictException(MSG.REVIEW_ALREADY_EXISTS);
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
    return this.reviewRepository.find({
      where: { sitterId },
      relations: ['owner'],
      order: { id: 'DESC' },
    });
  }
}
