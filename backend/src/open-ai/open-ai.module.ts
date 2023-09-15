import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OpenAiService, RelevancyScoreService } from './services';
import { openAiConfigFactory } from './open-ai-config.factory';

@Module({
  imports: [ConfigModule.forFeature(openAiConfigFactory)],
  providers: [OpenAiService, RelevancyScoreService],
  exports: [OpenAiService, RelevancyScoreService],
})
export class OpenAiModule {}
