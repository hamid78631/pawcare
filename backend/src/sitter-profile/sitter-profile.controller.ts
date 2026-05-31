import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SitterProfileService } from './sitter-profile.service';
import { CreateSitterProfileDto } from './dto/create-sitter-profile';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('sitter-profile')
export class SitterProfileController {
  constructor(private readonly sitterProfileService: SitterProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSitterProfileDto, @CurrentUser() user) {
    return this.sitterProfileService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.sitterProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitterProfileService.findOne(+id);
  }
}
