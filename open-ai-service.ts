import { OpenAI } from 'openai';

export class OpenAiService {
  private readonly MAX_RECURSION = 10;
  private readonly openAi: OpenAI;

  constructor() {
    this.openAi = new OpenAI({
      //apiKey: '', // defaults to process.env["OPENAI_API_KEY"]
    });
  }

  public async getAnswer(question: string): Promise<string> {
    const answer = await this.openAi.chat.completions.create({
      messages: [{ role: 'user', content: question }],
      model: 'gpt-3.5-turbo'
    });
    if (answer.choices.length !== 1) {
      throw new Error(`Unexpected number of answers: ${answer.choices.length}`);
    }

    if (answer.choices[0].finish_reason !== 'stop') {
      throw new Error(`Unexpected finish reason: ${answer.choices[0].finish_reason}`);
    };

    return answer.choices[0].message.content ?? '';
  }
}