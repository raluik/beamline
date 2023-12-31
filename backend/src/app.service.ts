import { Injectable } from '@nestjs/common';

import { ApolloIoService } from './apollo-io/services';
import { AppCompanyDto, AppListCompanyQueryDto } from './dtos';

@Injectable()
export class AppService {
  public constructor(private readonly apolloIoService: ApolloIoService) {}

  public async estimateRelevancy(
    query: AppListCompanyQueryDto,
  ): Promise<{ totalCount: number; organizations: AppCompanyDto[] }> {
    return this.apolloIoService.estimateRelevancy({
      ...query,
      organization_locations: query.locations,
      q_organization_keyword_tags: query.keywords,
      organization_num_employees_ranges: this.getCompanyEmployeeRange(query),
    });
  }

  private getCompanyEmployeeRange({
    minEmployeeCount,
    maxEmployeeCount,
  }: Pick<AppListCompanyQueryDto, 'minEmployeeCount' | 'maxEmployeeCount'>): [string] | undefined {
    return minEmployeeCount || maxEmployeeCount ? [`${minEmployeeCount ?? ''},${maxEmployeeCount ?? ''}`] : undefined;
  }
}
