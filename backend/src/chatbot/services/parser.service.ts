import { Injectable } from '@nestjs/common';
import { LeaveDraft } from '../types';
import { parseLeaveDate } from '../utils/date.util';

@Injectable()
export class ParserService {
  extractIsoDate(message: string): string | null {
    const m = String(message || '').match(/(\d{4})-(\d{2})-(\d{2})/);
    return m ? m[0] : null;
  }

  extractLeaveTypeCode(message: string, leaveTypes: { code: string }[]): string | null {
    const raw = String(message || '').trim();
    const tagged = raw.match(/type:\s*([A-Za-z]+)/i);
    const candidate = (tagged ? tagged[1] : raw).toUpperCase();
    const match = leaveTypes.find(t => (t.code ?? '').toUpperCase() === candidate);
    return match ? match.code.toUpperCase() : null;
  }

  parseLeaveRequestCode(text: string): string | null {
    const match = String(text || '').match(/\b(?:LV|LR)-?\d{3,}\b/i);
    return match ? match[0].toUpperCase() : null;
  }

  parseLeaveMessage(message: string): Omit<LeaveDraft, 'step' | 'isHalfDay' | 'session'> | null {
    const normalized = String(message || '').trim();
    const lower = normalized.toLowerCase();
    const typeMatch = lower.match(/\b(el|cl|lop|sick|wfh)\b/i);
    const dayTypeMatch = lower.match(/\b(full day|first half|second half)\b/i);
    const reasonMatch = normalized.match(/reason[:\-]?\s*(.+)$/i);
    const rangeMatch = normalized.match(/(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s*(?:\d{4})?)\s*(?:to|-)\s*(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s*(?:\d{4})?)/i);
    const singleDateMatch = normalized.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s*(\d{4})?/);
    if (!typeMatch || (!rangeMatch && !singleDateMatch)) return null;
    const leaveType = typeMatch[1].toUpperCase();
    const parseDate = (text: string): string | null => {
      const m = String(text || '').trim().match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s*(\d{4})?/i);
      if (!m) return null;
      const day = String(m[1]).padStart(2, '0');
      const months: Record<string, string> = { january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12' };
      const month = months[m[2].toLowerCase()];
      const year = m[3] || String(new Date().getFullYear());
      return month ? `${year}-${month}-${day}` : null;
    };
    const startDate = rangeMatch ? parseDate(rangeMatch[1]) : parseDate(singleDateMatch![0]);
    const endDate = rangeMatch ? parseDate(rangeMatch[2]) : startDate;
    if (!startDate || !endDate) return null;
    const duration = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    if (duration < 1) return null;
    return {
      leaveType, leaveDate: startDate, startDate, endDate, duration,
      dayType: dayTypeMatch ? dayTypeMatch[1] : 'Full Day',
      reason: reasonMatch ? reasonMatch[1].trim() : '',
    };
  }

  parseLeaveDate(text: string): string | null {
    return parseLeaveDate(text);
  }

  resolveLeaveTypeId(code: string, leaveTypes: { id: number; code: string }[]): number | null {
    const aliases: Record<string, string> = { SICK: 'SL', CASUAL: 'CL', EARNED: 'EL' };
    const norm = (aliases[code.toUpperCase()] ?? code).toUpperCase();
    const match = leaveTypes.find(t => (t.code ?? '').toUpperCase() === norm);
    return match ? match.id : null;
  }

  sessionLabel(session: string): string {
    if (session === 'FirstHalf') return 'First Half';
    if (session === 'SecondHalf') return 'Second Half';
    return session;
  }
}