import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly aiClient?: OpenAI;
  readonly aiEnabled: boolean;
  readonly aiModel: string;
  readonly aiProvider: string;

  constructor(private readonly configService: ConfigService) {
    const groqKey = this.configService.get<string>('GROQ_API_KEY');
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (groqKey) {
      this.aiClient = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.aiModel =
        this.configService.get<string>('GROQ_MODEL') || 'openai/gpt-oss-20b';
      this.aiProvider = 'Groq';
      this.aiEnabled = true;
    } else if (openaiKey) {
      this.aiClient = new OpenAI({ apiKey: openaiKey });
      this.aiModel =
        this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';
      this.aiProvider = 'OpenAI';
      this.aiEnabled = true;
    } else {
      this.aiModel = 'none';
      this.aiProvider = 'none';
      this.aiEnabled = false;
    }
  }

  async generateAIResponse(sanitizedMsg: string, user: Record<string, any>) {
    if (!this.aiClient) throw new Error('AI client not configured');

    const isPrivileged = user.role === 'admin' || user.role === 'hr';

    const systemPrompt = [
      `You are "Chat With SIA", a friendly general-purpose assistant inside an HRMS portal.`,

      `Answer the user's question directly and accurately.`,

      `You can answer general questions about AI, AGI, technology, programming, finance, investment, tax, education, science, sports, entertainment, travel, writing, grammar, and general HR concepts.`,

      `Questions such as "What is AI?", "What is AGI?", "What is tax?", "What is investment?", "What is attendance?", and "What is casual leave?" are general questions. Answer them directly.`,

      `Do not assume that a general question is asking for the user's personal HRMS information.`,

      `Only refuse or redirect when the user explicitly asks for personal or company-specific information that you cannot access.`,

      `Never invent personal employee data, salary data, attendance records, leave balances, or company-specific information.`,

      `Answer in 1-3 short sentences only.`,

      `Do not add unnecessary disclaimers, introductions, or follow-up questions.`,

      `Be concise, friendly, and direct.`,

      `Current user: ${user.name} (Role: ${user.role}).`,
    ].join('\n');

    const response = await this.aiClient.chat.completions.create({
      model: this.aiModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: sanitizedMsg },
      ],
      temperature: 0.3,
      max_tokens: 120,
    });

    const raw = response.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error('AI returned an empty response');
    }

    return raw;
  }

  status() {
    return {
      status: 'Chatbot service running',
      type: this.aiEnabled
        ? `AI-Powered (${this.aiProvider})`
        : 'Rule-based (Pattern Matching)',
      aiEnabled: this.aiEnabled,
      model: this.aiEnabled ? this.aiModel : 'None',
      fallback: 'Rule-based patterns available as backup',
      message: this.aiEnabled
        ? `AI responses enabled via ${this.aiProvider} API`
        : 'Set GROQ_API_KEY or OPENAI_API_KEY in .env to enable AI responses',
    };
  }
}
