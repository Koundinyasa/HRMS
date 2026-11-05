// import { Module } from '@nestjs/common';
// import { MailService } from './mail.service';

// @Module({
//   providers: [MailService],
//   exports: [MailService],
// })
// export class MailModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { Msg91EmailService } from './msg91-email.service';
 
@Module({
  imports: [ConfigModule],
  providers: [
    MailService,
    Msg91EmailService,
  ],
  exports: [MailService],
})
export class MailModule {}