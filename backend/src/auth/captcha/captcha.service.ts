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
      // Case-sensitive CAPTCHA answer
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
 
    // Case-sensitive exact comparison
    return input === entry.answer;
  }
 
  private generateText(length = 6): string {
    // Uppercase letters and numbers only
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 
    let result = '';
 
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
 
    return result;
  }
 
  private createCaptcha(text: string): string {
    const width = 220;
    const height = 80;
 
    const canvas = createCanvas(width, height);
 
    const ctx = canvas.getContext('2d');
 
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
 
    // Colors
    const colors = [
      '#1E40AF',
      '#DC2626',
      '#7E22CE',
      '#16A34A',
      '#6B21A8',
      '#556B2F',
    ];
 
    ctx.font = 'bold 46px Arial';
 
    for (let i = 0; i < text.length; i++) {
      ctx.save();
 
      const x = 20 + i * 30;
 
      const y = 55 + (Math.random() * 10 - 5);
 
      ctx.translate(x, y);
 
      ctx.rotate((Math.random() - 0.5) * 0.4);
 
      ctx.fillStyle = colors[i % colors.length];
 
      ctx.fillText(text[i], 0, 0);
 
      ctx.restore();
    }
 
    // Curved line
    ctx.strokeStyle = '#666';
 
    ctx.lineWidth = 2;
 
    ctx.beginPath();
 
    ctx.moveTo(0, 28);
 
    ctx.quadraticCurveTo(
      width / 2,
      70,
      width,
      18,
    );
 
    ctx.stroke();
 
    // Noise dots
    for (let i = 0; i < 550; i++) {
      ctx.beginPath();
 
      ctx.fillStyle = '#999';
 
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        1,
        0,
        Math.PI * 2,
      );
 
      ctx.fill();
    }
 
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