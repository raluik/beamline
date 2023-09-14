import * as path from 'path';

import { APP_PIPE } from '@nestjs/core';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloIoModule } from './apollo-io/apollo-io.module';

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
    AppService,
  ],
  imports: [
    ApolloIoModule,
    ConfigModule.forRoot({ envFilePath: path.resolve(__dirname, `../config/${process.env.NODE_ENV}.env`) }),
  ],
})
export class AppModule {}
