import { TYPO_MAP } from '../constants/typo.constants';
import { levenshteinDistance } from './fuzzy.util';

export function normalizeText(raw: string): string {
  let text = String(raw || '')
    .toLowerCase()
    .replace(/(.)\1{2,}/g, '$1')
    .replace(/[^a-z0-9 \-\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (const [bad, good] of Object.entries(TYPO_MAP)) {
    text = text.replace(new RegExp(`\\b${bad}\\b`, 'g'), good);
  }
  return text;
}

export function normalizeMessage(text: string): string {
  let normalized = String(text || '').toLowerCase().replace(/[^a-z0-9\s']/g, ' ');
  for (const [bad, good] of Object.entries(TYPO_MAP)) {
    normalized = normalized.replace(new RegExp(`\\b${bad}\\b`, 'g'), good);
  }

  const dictionary = [...new Set([
    ...Object.values(TYPO_MAP),
    'leave', 'approve', 'cancel', 'request', 'details', 'profile', 'salary', 'payroll', 'payslip',
    'tax', 'form16', 'employee', 'employees', 'my', 'me', 'all', 'holidays', 'holiday',
    'department', 'designation', 'training', 'document', 'documents', 'company', 'policy',
    'policies', 'office', 'benefits', 'attendance', 'manager', 'hr', 'admin', 'team', 'email', 'contact',
    'latest', 'recent', 'status', 'half', 'full', 'session',
  ])];

  const tokens = normalized.split(/\s+/).map(token => {
    if (!token || dictionary.includes(token)) return token;
    let best = { word: token, distance: Infinity };
    for (const word of dictionary) {
      const d = levenshteinDistance(token, word);
      if (d < best.distance) best = { word, distance: d };
    }
    return best.distance <= 2 ? best.word : token;
  });

  return tokens.join(' ').replace(/\s+/g, ' ').trim();
}

// Generic "numbered steps + optional footer" formatter used by several
// guide-style replies (salary, Form16, profile, document access, etc.)
export function buildMenuGuide(title: string, steps: string[], footer = ''): string {
  const stepText = steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
  return `${title}\n${stepText}${footer ? `\n\n${footer}` : ''}`;
}

export function getGeneralHelpGuide(userName: string): string {
  return `Hi ${userName}. I can answer questions about the portal, company holidays, announcements, office policies, today's date, and more. You can also apply for leave through me — just say "Apply leave" or use the ☰ Menu.`;
}
