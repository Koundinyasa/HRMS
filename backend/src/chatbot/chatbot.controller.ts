// import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
// import { ChatbotService } from './services/chatbot.service';
// import { ChatRequestDto } from './dto/chat-request.dto';
// import { AuthService } from '../auth/auth.service';

// @Controller('chatbot')
// export class ChatbotController {
//   constructor(
//     private readonly chatbotService: ChatbotService,
//     private readonly authService: AuthService,
//   ) {}

//   @Post('chat')
//   async chat(@Body() body: ChatRequestDto, @Headers('authorization') authorization?: string) {
//     const token = authorization?.split(' ')[1];
//     let tokenPayload: Record<string, any> | null = null;

//     if (token) {
//       tokenPayload = this.authService.verifyAccessToken(token);
//     }

//     return this.chatbotService.chat(body.message, tokenPayload ?? undefined);
//   }

//   @Get('status')
//   status() {
//     return this.chatbotService.status();
//   }
// }




import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatbotService } from './services/chatbot.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('chatbot')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(
    @Body() body: ChatRequestDto,
    @Req() req: any,
  ): Promise<any> {
    //console.log("REQ.USER:", req.user);
    return this.chatbotService.chat(
      body.message,
      req.user,
    );
  }

  @Get('status')
  status(): any {
    return this.chatbotService.status();
  }
}