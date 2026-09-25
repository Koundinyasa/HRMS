import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { createCanvas } from 'canvas';

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

  generate(): {
    captchaId: string;
    image: string;
    debugAnswer?: string;
  } {
    this.purgeExpired();

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
      ...(this.isProd ? {} : { debugAnswer: text }),
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
    result.push(uppercase[Math.floor(Math.random() * uppercase.length)]);

    // Guarantee at least one lowercase
    result.push(lowercase[Math.floor(Math.random() * lowercase.length)]);

    // Guarantee at least one number
    result.push(numbers[Math.floor(Math.random() * numbers.length)]);

    // Generate remaining characters
    for (let i = result.length; i < length; i++) {
      result.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle characters
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
  }

  private createCaptcha(text: string): string {
    const width = 220;
    const height = 80;

    const canvas = createCanvas(width, height);

    const ctx = canvas.getContext('2d');

    // ===============================
    // Background
    // ===============================

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // ===============================
    // CAPTCHA Colors
    // ===============================

    const colors = [
      '#1E40AF',
      '#DC2626',
      '#7E22CE',
      '#16A34A',
      '#6B21A8',
      '#556B2F',
    ];

    // ===============================
    // CAPTCHA Characters
    // ===============================

    ctx.font = 'bold 46px Arial';

    for (let i = 0; i < text.length; i++) {
      ctx.save();

      const x = 20 + i * 30;
      const y = 55 + (Math.random() * 10 - 5);

      ctx.translate(x, y);

      // Random character rotation
      ctx.rotate((Math.random() - 0.5) * 0.4);

      ctx.fillStyle = colors[i % colors.length];

      ctx.fillText(text[i], 0, 0);

      ctx.restore();
    }

    // ===============================
    // Noise Dots
    // ===============================

    for (let i = 0; i < 1000; i++) {
      ctx.beginPath();

      ctx.fillStyle = '#999';

      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2);

      ctx.fill();
    }

    // ===============================
    // CURVE DISTORTION LINE 1
    // ===============================

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(0, 40);

    ctx.quadraticCurveTo(width / 2, 70, width, 18);

    ctx.stroke();

    // ===============================
    // CURVE DISTORTION LINE 2
    // ===============================

    ctx.strokeStyle = '#777';
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(0, 55);

    ctx.quadraticCurveTo(width / 2, 5, width, 55);

    ctx.stroke();

    return canvas.toDataURL();
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
