import { Injectable } from '@nestjs/common';

import { ApolloIoService } from './apollo-io/services';
import { AppCompanyDto, AppListCompanyQueryDto } from './dtos';

@Injectable()
export class AppService {
  public constructor(private readonly apolloIoService: ApolloIoService) {}

  public async listCompanies(query: AppListCompanyQueryDto): Promise<AppCompanyDto[]> {
    return this.apolloIoService.listOrganizations({
      ...query,
      organization_locations: query.locations,
      q_organization_keyword_tags: query.keywords,
    });
  }
}
