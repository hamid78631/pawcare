import { Injectable, NotFoundException } from '@nestjs/common';
import {Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {Animal} from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';  
@Injectable()
export class AnimalsService {

    constructor( @InjectRepository(Animal)
        private animalsRepository : Repository<Animal>){}

    create(createAnimalDto : CreateAnimalDto , ownerId : number) {
        const animal = this.animalsRepository.create({...createAnimalDto , 
            ownerId
        })
        return this.animalsRepository.save(animal);
    }

    findAllByOwner(ownerId : number){
        return this.animalsRepository.findBy({ownerId});
    }

    
    async findOne(id: number) {
  const animal = await this.animalsRepository.findOneBy({ id });
  if (!animal) {
    throw new NotFoundException(`Animal #${id} not found`);
  }
  return animal;
}
}
