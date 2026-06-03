import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @Post()
  create(@Body() dto: CreateReviewDto, @CurrentUser() user) {
    return this.reviewService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('sitter/:sitterId')
  findBySitter(@Param('sitterId') sitterId: string) {
    return this.reviewService.findBySitter(+sitterId);
  }
}
