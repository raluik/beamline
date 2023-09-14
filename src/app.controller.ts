import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AppCompanyDto, AppListCompanyQueryDto, DataResponseDto } from './dtos';

@Controller({
  version: '1',
  path: '/app',
})
@ApiTags('company')
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get('/companies')
  public async listCompanies(@Query() query: AppListCompanyQueryDto): Promise<DataResponseDto<AppCompanyDto[]>> {
    return { data: await this.appService.listCompanies(query) };
  }
}
