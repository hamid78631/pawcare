import { Body, Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { BookingStatus } from './entities/booking.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles(UserRole.OWNER)
  @Post()
  create(@Body() dto: CreateBookingDto, @CurrentUser() user) {
    return this.bookingService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('mine')
  findMine(@CurrentUser() user) {
    return this.bookingService.findByOwner(user.id);
  }

  @Get('incoming')
  findIncoming(@CurrentUser() user) {
    return this.bookingService.findBySitter(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.bookingService.updateStatus(+id, status);
  }
}
