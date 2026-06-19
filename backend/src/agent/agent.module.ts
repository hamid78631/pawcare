import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { SitterProfileModule } from '../sitter-profile/sitter-profile.module';
import { AnimalsModule } from '../animals/animals.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [SitterProfileModule, AnimalsModule, BookingModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
