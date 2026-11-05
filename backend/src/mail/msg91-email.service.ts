 
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
 
@Injectable()
export class Msg91EmailService {
  private readonly logger = new Logger(Msg91EmailService.name);
 
  private readonly apiUrl =
    'https://control.msg91.com/api/v5/email/send';
 
  constructor(private readonly configService: ConfigService) {}
 
  async sendEmail(
    email: string,
    name: string,
    templateId: string,
    variables: Record<string, string>,
  ): Promise<any> {
    const authKey = this.configService.get<string>('MSG91_AUTH_KEY');
    const domain = this.configService.get<string>('MSG91_DOMAIN');
    const fromEmail = this.configService.get<string>('MSG91_FROM_EMAIL');
 
    if (!authKey || !domain || !fromEmail || !templateId) {
      throw new InternalServerErrorException(
        'MSG91 configuration is missing',
      );
    }
 
    const body = {
      recipients: [
        {
          to: [
            {
              email,
              name: name || email,
            },
          ],
          variables,
        },
      ],
      from: {
        email: fromEmail,
        name: 'HRMS System',
      },
      domain,
      template_id: templateId,
    };
 
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authkey: authKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
 
      const responseText = await response.text();
 
      let result: any;
 
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { message: responseText };
      }
 
      if (
        !response.ok ||
        result?.type === 'error' ||
        result?.success === false ||
        result?.status === 'error'
      ) {
        this.logger.error(
          `MSG91 email failed. HTTP status: ${response.status}`,
        );
 
        throw new InternalServerErrorException(
          'MSG91 email request failed',
        );
      }
 
      this.logger.log(
        `MSG91 accepted email request for template: ${templateId}`,
      );
 
      return result;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
 
      this.logger.error(
        'Unable to connect to MSG91',
        error instanceof Error ? error.stack : undefined,
      );
 
      throw new InternalServerErrorException(
        'Unable to send email using MSG91',
      );
    }
  }
}
 
 