import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitterProfile } from './entities/sitter-profile.entity';
import { Repository } from 'typeorm';
import { CreateSitterProfileDto } from './dto/create-sitter-profile';
import { UpdateSitterProfileDto } from './dto/update-sitter-profile.dto';

@Injectable()
export class SitterProfileService {
  constructor(
    @InjectRepository(SitterProfile)
    private sitterProfileRepository: Repository<SitterProfile>,
  ) {}

  async create(dto: CreateSitterProfileDto, userId: number) {
    const existingProfile = await this.sitterProfileRepository.findOne({ where: { userId } });
    if (existingProfile) {
      throw new ConflictException('Sitter profile already exists for this user.');
    }
    const profile = this.sitterProfileRepository.create({ ...dto, userId });
    return this.sitterProfileRepository.save(profile);
  }

  findAll() {
    return this.sitterProfileRepository.find();
  }

  async findOne(id: number) {
    const profile = await this.sitterProfileRepository.findOneBy({ id });
    if (!profile) {
      throw new NotFoundException('Sitter profile not found.');
    }
    return profile;
  }

  async update(userId: number, dto: UpdateSitterProfileDto) {
    const profile = await this.sitterProfileRepository.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Sitter profile not found.');
    }
    Object.assign(profile, dto);
    return this.sitterProfileRepository.save(profile);
  }

  async search(city?: string, animalType?: string) {
    const qb = this.sitterProfileRepository.createQueryBuilder('profile')
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
