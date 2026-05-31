import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitterProfileController } from './sitter-profile.controller';
import { SitterProfileService } from './sitter-profile.service';
import { SitterProfile } from './entities/sitter-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SitterProfile])],
  controllers: [SitterProfileController],
  providers: [SitterProfileService],
})
export class SitterProfileModule {}
