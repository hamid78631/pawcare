import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { MSG } from '../constants/messages';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private animalsRepository: Repository<Animal>,
  ) {}

  create(dto: CreateAnimalDto, ownerId: number) {
    const animal = this.animalsRepository.create({ ...dto, ownerId });
    return this.animalsRepository.save(animal);
  }

  findAllByOwner(ownerId: number) {
    return this.animalsRepository.findBy({ ownerId });
  }

  async findOne(id: number) {
    const animal = await this.animalsRepository.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(MSG.ANIMAL_NOT_FOUND);
    }
    return animal;
  }

  async update(id: number, dto: UpdateAnimalDto, ownerId: number) {
    const animal = await this.findOne(id);
    if (animal.ownerId !== ownerId) {
      throw new ForbiddenException(MSG.ANIMAL_FORBIDDEN);
    }
    Object.assign(animal, dto);
    return this.animalsRepository.save(animal);
  }

  async remove(id: number, ownerId: number) {
    const animal = await this.findOne(id);
    if (animal.ownerId !== ownerId) {
      throw new ForbiddenException(MSG.ANIMAL_DELETE_FORBIDDEN);
    }
    return this.animalsRepository.remove(animal);
  }
}
