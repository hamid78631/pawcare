import { Controller, Post , Body, UseGuards, Get, Param} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('animals')
@UseGuards(JwtAuthGuard)
export class AnimalsController {
    constructor(
        private readonly animalsService: AnimalsService
    ){}

    @Post()
    create(@Body() createAnimalDto : CreateAnimalDto , @CurrentUser() user){
        return this.animalsService.create(createAnimalDto , user.id);
    }

    @Get()
    findAll(@CurrentUser() user){
        return this.animalsService.findAllByOwner(user.id);
    }
    @Get(':id')
    findOne(@Param('id') id : string){
        return this.animalsService.findOne(+id);
    }
}
