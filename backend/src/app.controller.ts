import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AppListCompanyQueryDto } from './dtos';

@Controller({
  version: '1',
  path: '/app',
})
@ApiTags('company')
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get('/companies')
  public async listCompanies(@Query() query: AppListCompanyQueryDto) {
    return this.appService.estimateRelevancy(query);
  }
}
