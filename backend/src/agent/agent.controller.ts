import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ChatDto } from './dto/chat.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('chat')
  async chat(@Body() dto: ChatDto, @CurrentUser() user) {
    const reply = await this.agentService.chat(dto.messages, user);
    return { reply };
  }
}
