import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt, randomUUID } from 'crypto';
interface CaptchaEntry {
  answer: string;
  expiresAt: number;
}
@Injectable()
export class CaptchaService {
  // Upper limit on unanswered captchas kept in memory (the oldest are dropped).
  private static readonly MAX_STORED = 5000;
  private readonly store = new Map<string, CaptchaEntry>();
  private readonly ttlMs: number;
  private readonly debugAnswer: boolean;
 
  constructor(private readonly configService: ConfigService) {
    const ttlMinutes =
      this.configService.get<number>('captcha.ttlMinutes') ?? 5;
 
    this.ttlMs = ttlMinutes * 60 * 1000;
 
    // Only when explicitly enabled (CAPTCHA_DEBUG_ANSWER=true) and never in production.
    this.debugAnswer =
      this.configService.get<boolean>('captcha.debugAnswer') === true &&
      this.configService.get<string>('environment') !== 'production';
  }
 
  generate(): {
    captchaId: string;
    image: string;
    debugAnswer?: string;
  } {
    this.purgeExpired();
    this.enforceCapacity();
 
    const text = this.generateText();
 
    const image = this.createCaptcha(text);
 
    const captchaId = randomUUID();
 
    this.store.set(captchaId, {
      // Store exact CAPTCHA text
      answer: text,
      expiresAt: Date.now() + this.ttlMs,
    });
 
    return {
      captchaId,
      image,
      ...(this.debugAnswer ? { debugAnswer: text } : {}),
    };
  }
 
  validate(captchaId: string, input: string): boolean {
    const entry = this.store.get(captchaId);

    // CAPTCHA can be used only once
    this.store.delete(captchaId);

    if (!entry) {
      return false;
    }

    // Check expiry
    if (Date.now() > entry.expiresAt) {
      return false;
    }

    // Exact, case-sensitive CAPTCHA validation
    return input === entry.answer;
  }

  /**
   * Generates a 6-character CAPTCHA.
   *
   * Rules:
   * - At least one uppercase alphabet
   * - At least one lowercase alphabet
   * - At least one number
   * - Remaining characters can be uppercase, lowercase, or number
   * - Case-sensitive
   */
  private generateText(length = 6): string {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';

    const allChars = uppercase + lowercase + numbers;

    const result: string[] = [];

    // Guarantee at least one uppercase
    result.push(uppercase[randomInt(uppercase.length)]);

    // Guarantee at least one lowercase
    result.push(lowercase[randomInt(lowercase.length)]);

    // Guarantee at least one number
    result.push(numbers[randomInt(numbers.length)]);

    // Generate remaining characters
    for (let i = result.length; i < length; i++) {
      result.push(allChars[randomInt(allChars.length)]);
    }

    // Shuffle characters
    for (let i = result.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);

      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
  }
 
  private createCaptcha(text: string): string {
    const width = 220;
    const height = 80;
    const colors = [
      '#1E40AF',
      '#DC2626',
      '#7E22CE',
      '#16A34A',
      '#6B21A8',
      '#556B2F',
    ];
    const characters = [...text]
      .map((character, index) => {
        const x = 20 + index * 30;
        const y = 55 + (Math.random() * 10 - 5);
        const rotation = ((Math.random() - 0.5) * 0.4 * 180) / Math.PI;

        return `<text x="${x}" y="${y}" fill="${colors[index % colors.length]}" transform="rotate(${rotation} ${x} ${y})">${character}</text>`;
      })
      .join('');
    const noise = Array.from({ length: 1000 }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return `<circle cx="${x}" cy="${y}" r="1" fill="#999"/>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#fff"/><g font-family="Arial,sans-serif" font-size="46" font-weight="bold">${characters}</g><g>${noise}</g><path d="M0 40 Q110 70 220 18" fill="none" stroke="#666" stroke-width="2"/><path d="M0 55 Q110 5 220 55" fill="none" stroke="#777" stroke-width="1.5"/></svg>`;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  // Caps memory use if someone requests captchas in a loop. A Map keeps
  // insertion order, so the first keys are the oldest.
  private enforceCapacity(): void {
    while (this.store.size >= CaptchaService.MAX_STORED) {
      const oldest = this.store.keys().next().value;
      if (oldest === undefined) break;
      this.store.delete(oldest);
    }
  }

  private purgeExpired(): void {
    const now = Date.now();
 
    for (const [id, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(id);
      }
    }
  }
}
