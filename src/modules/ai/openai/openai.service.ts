import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async ask(prompt: string, systemPrompt: string): Promise<string | null> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1', // Más barato para empezar
        response_format: { type: 'json_object' },
        seed: 42, // Para reproducibilidad
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // Bajo para respuestas más consistentes
      });

      return response.choices[0].message.content;
    } catch {
      throw new InternalServerErrorException(
        'Error communicating with OpenAI API',
      );
    }
  }
}
