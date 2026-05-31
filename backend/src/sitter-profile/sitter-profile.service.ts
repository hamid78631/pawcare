import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SitterProfile } from './entities/sitter-profile.entity';
import { Repository } from 'typeorm';
import { CreateSitterProfileDto } from './dto/create-sitter-profile';
@Injectable()
export class SitterProfileService {

    constructor(
        @InjectRepository(SitterProfile)
        private sitterProfileRepository : Repository<SitterProfile>
    ){}

    async create(createSitterProfileDto : CreateSitterProfileDto , userId : number){
        const existingProfile = await this.sitterProfileRepository.findOne({where : {userId}});
        if(existingProfile){
            throw new ConflictException('Sitter profile already exists for this user.');
        }

        const profile = this.sitterProfileRepository.create({
            ...createSitterProfileDto , 
            userId
        });
        return this.sitterProfileRepository.save(profile);
    }

    async findAll(){
        return this.sitterProfileRepository.find();
    }

    async findOne(id: number){
        const profile = await this.sitterProfileRepository.findOneBy({id});
        if(!profile){
            throw new NotFoundException('Sitter profile not found.');
        }
        return profile;
    }

}
