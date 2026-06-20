import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as svgCaptcha from 'svg-captcha';

interface CaptchaEntry {
  answer: string;
  expiresAt: number;
}

@Injectable()
export class CaptchaService {
  private readonly store = new Map<string, CaptchaEntry>();

  generate(): { captchaId: string; svg: string; debugAnswer?: string } {
    this.purgeExpired();

    const { data: svg, text } = svgCaptcha.create({
      size: 6,
      noise: 3,
      color: true,
      background: '#eef2ff',
      ignoreChars: '0O1Il',
      width: 160,
      height: 50,
      fontSize: 46,
    });

    const captchaId = randomUUID();
    const answer = text.toLowerCase();

    this.store.set(captchaId, {
      answer,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min TTL
    });

    console.log(`[Captcha] ID: ${captchaId} | Answer: ${text}`);

    return { captchaId, svg, ...(process.env.NODE_ENV !== 'production' && { debugAnswer: text }), };
  }

  validate(captchaId: string, input: string): boolean {
    console.log('[Captcha] Store size before validate:', this.store.size);
    console.log('[Captcha] Looking for ID:', captchaId);
    console.log('[Captcha] Has ID:', this.store.has(captchaId));
    const entry = this.store.get(captchaId);

    // Always delete — single use
    this.store.delete(captchaId);

    if (!entry) {
      console.log('[Captcha] NOT FOUND — already used or server restarted');
      return false;
    }


    if (Date.now() > entry.expiresAt) {
      console.log('[Captcha] EXPIRED — captcha has expired');
      return false;
    }

    const result = input.trim().toLowerCase() === entry.answer;
    console.log(`[Captcha] Input: "${input}" | Answer: "${entry.answer}" | Match: ${result}`);
    return result;
  }

  debugStore() {
    const entries: any[] = [];
    for (const [id, entry] of this.store.entries()) {
      entries.push({
        id,
        answer: entry.answer,
        expiresAt: new Date(entry.expiresAt).toISOString(),
        expired: Date.now() > entry.expiresAt,
      });
    }
    return {
      storeSize: this.store.size,
      entries,
    };
  }

  private purgeExpired(): void {
    const now = Date.now();
    for (const [id, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(id);
    }
  }
}