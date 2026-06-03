import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

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
      throw new NotFoundException(`Animal #${id} not found`);
    }
    return animal;
  }

  async update(id: number, dto: UpdateAnimalDto, ownerId: number) {
    const animal = await this.findOne(id);
    if (animal.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own animals');
    }
    Object.assign(animal, dto);
    return this.animalsRepository.save(animal);
  }

  async remove(id: number, ownerId: number) {
    const animal = await this.findOne(id);
    if (animal.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own animals');
    }
    return this.animalsRepository.remove(animal);
  }
}
