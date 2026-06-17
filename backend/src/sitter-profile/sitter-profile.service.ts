import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitterProfile } from './entities/sitter-profile.entity';
import { Repository } from 'typeorm';
import { CreateSitterProfileDto } from './dto/create-sitter-profile';
import { UpdateSitterProfileDto } from './dto/update-sitter-profile.dto';
import { MSG } from '../constants/messages';

@Injectable()
export class SitterProfileService {
  constructor(
    @InjectRepository(SitterProfile)
    private sitterProfileRepository: Repository<SitterProfile>,
  ) {}

  async create(dto: CreateSitterProfileDto, userId: number) {
    const existingProfile = await this.sitterProfileRepository.findOne({ where: { userId } });
    if (existingProfile) {
      throw new ConflictException(MSG.SITTER_PROFILE_EXISTS);
    }
    const profile = this.sitterProfileRepository.create({ ...dto, userId });
    return this.sitterProfileRepository.save(profile);
  }

  findAll() {
    return this.sitterProfileRepository.find();
  }

  async findOne(id: number) {
    const profile = await this.sitterProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(MSG.SITTER_PROFILE_NOT_FOUND);
    }
    return profile;
  }

  async findByUserId(userId: number) {
    const profile = await this.sitterProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(MSG.SITTER_PROFILE_NOT_FOUND);
    }
    return profile;
  }

  async update(userId: number, dto: UpdateSitterProfileDto) {
    const profile = await this.sitterProfileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(MSG.SITTER_PROFILE_NOT_FOUND);
    }
    Object.assign(profile, dto);
    return this.sitterProfileRepository.save(profile);
  }

  async search(city?: string, animalType?: string) {
    const qb = this.sitterProfileRepository.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.isAvailable = :isAvailable', { isAvailable: true });
    if (city) {
      qb.andWhere('profile.city ILIKE :city', { city: `%${city}%` });
    }
    if (animalType) {
      qb.andWhere('profile.acceptedAnimalTypes LIKE :animalType', { animalType: `%${animalType}%` });
    }
    return qb.getMany();
  }
}
