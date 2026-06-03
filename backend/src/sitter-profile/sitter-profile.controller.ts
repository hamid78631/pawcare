import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SitterProfileService } from './sitter-profile.service';
import { CreateSitterProfileDto } from './dto/create-sitter-profile';
import { UpdateSitterProfileDto } from './dto/update-sitter-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('sitter-profile')
export class SitterProfileController {
  constructor(private readonly sitterProfileService: SitterProfileService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SITTER)
  @Post()
  create(@Body() dto: CreateSitterProfileDto, @CurrentUser() user) {
    return this.sitterProfileService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.sitterProfileService.findAll();
  }

  @Get('search')
  search(@Query('city') city?: string, @Query('animalType') animalType?: string) {
    return this.sitterProfileService.search(city, animalType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitterProfileService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SITTER)
  @Patch()
  update(@Body() dto: UpdateSitterProfileDto, @CurrentUser() user) {
    return this.sitterProfileService.update(user.id, dto);
  }
}
