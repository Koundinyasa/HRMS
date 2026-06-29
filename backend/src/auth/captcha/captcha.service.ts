import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as svgCaptcha from 'svg-captcha';

interface CaptchaEntry {
  answer: string;
  expiresAt: number;
}

@Injectable()
export class CaptchaService {
  private readonly store = new Map<string, CaptchaEntry>();
  private readonly ttlMs: number;
  private readonly isProd: boolean;

  constructor(private readonly configService: ConfigService) {
    const ttlMinutes =
      this.configService.get<number>('captcha.ttlMinutes') ?? 5;
    this.ttlMs = ttlMinutes * 60 * 1000;
    this.isProd =
      this.configService.get<string>('environment') === 'production';
  }

  generate(): { captchaId: string; svg: string; debugAnswer?: string } {
    this.purgeExpired();

    const { data: svg, text } = svgCaptcha.create({
      size: 6,
      // noise: 3,
      color: true,
      background: '#eef2ff',
      ignoreChars: '0O1Ilabcdefghi',
      width: 160,
      height: 50,
      fontSize: 46,
    });

    const captchaId = randomUUID();

    this.store.set(captchaId, {
      answer: text.toLowerCase(),
      expiresAt: Date.now() + this.ttlMs,
    });

    // debugAnswer is only included outside production and is never logged
    return {
      captchaId,
      svg,
      ...(this.isProd ? {} : { debugAnswer: text }),
    };
  }

  validate(captchaId: string, input: string): boolean {
    const entry = this.store.get(captchaId);
    this.store.delete(captchaId); // single-use regardless of outcome

    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;

    return input.trim().toLowerCase() === entry.answer;
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [id, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(id);
    }
  }
}