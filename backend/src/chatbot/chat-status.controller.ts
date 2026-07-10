import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './services/chatbot.service';

@Controller('chatbot')
export class ChatbotStatusController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('status')
  status() {
    return this.chatbotService.status();
  }
}
