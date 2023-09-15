import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { apolloIoConfigFactory } from '../apollo-io-config.factory';
import {
  ApolloIoConfig,
  EnrichedOrganization,
  GetEnrichedOrganizationResponse,
  ListOrganizationQuery,
  ListOrganizationResponse,
  Organization,
} from '../interfaces';
import { CompanyData, RelevancyScoreService } from '../../open-ai/services';
import { UrlUtil } from '../../utils';
import { AppCompanyDto } from '../../dtos';
import { AppStateService, AppStatus } from 'src/websocket/app-state.service';

@Injectable()
export class ApolloIoService {
  private readonly API_URL = 'https://api.apollo.io';

  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly PAGE_LIMIT = 1;

  public constructor(
    @Inject(apolloIoConfigFactory.KEY) private readonly apolloIoConfig: ApolloIoConfig,
    private readonly httpService: HttpService,
    private readonly relevancyScoreService: RelevancyScoreService,
    private readonly appState: AppStateService,
  ) {}

  public async estimateRelevancy(
    query: Pick<
      ListOrganizationQuery,
      'organization_locations' | 'q_organization_keyword_tags' | 'organization_num_employees_ranges'
    > & {
      readonly relevanceKeywords: string[];
    },
  ): Promise<{ totalCount: number; organizations: AppCompanyDto[] }> {
    try {
      this.appState.setStatus(AppStatus.RUNNING);
      this.appState.setStatusText('Fetching companies from Apollo.io...');
      const { totalCount, organizations } = await this.getOrganizations(query);
      const organizationsWithDomains = organizations.filter((organization) => organization.primary_domain);
      this.appState.setStatusText('Fetching addition data for companies from Apollo.io...');
      const enrichedOrganizations = await this.enrichOrganizations(organizationsWithDomains);

      const companies: CompanyData[] = enrichedOrganizations.map((c) => ({
        name: c.name,
        industry: c.industry,
        country: c.country,
        seo: c.seo_description,
        description: c.short_description,
      }));
      console.log(
        `################# APOLLO ################# RESULTS (${companies.length}): ${companies
          .map((c) => c.name)
          .join(', ')}`,
      );

      this.appState.setStatusText('Estimating relevancy scores with ChatGPT...');
      const results = await this.relevancyScoreService.getRelevancyScores(companies, query.relevanceKeywords);
      console.log(JSON.stringify(results, null, 2));

      return {
        totalCount,
        organizations: results.sort((company1, company2) => company2.score - company1.score),
      };
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      this.appState.setStatus(AppStatus.IDLE);
      this.appState.setStatusText('');
    }
  }

  private async getOrganizations(
    query: Pick<
      ListOrganizationQuery,
      'organization_locations' | 'q_organization_keyword_tags' | 'organization_num_employees_ranges'
    >,
  ): Promise<{ totalCount: number; organizations: Organization[] }> {
    const organizations: Organization[] = [];
    let totalCount: number;

    let response: ListOrganizationResponse | null = null;
    do {
      response = await this.getOrganizationsPage({
        ...query,
        page: response?.pagination ? response.pagination.page + 1 : 1,
      });
      if (totalCount === undefined) {
        totalCount = response.pagination.total_entries;
      }

      organizations.push(...response.organizations);
    } while (response.pagination.page < response.pagination.total_pages && response.pagination.page < this.PAGE_LIMIT);

    return { totalCount, organizations };
  }

  private async getOrganizationsPage(
    query: ListOrganizationQuery & { readonly page: number },
  ): Promise<ListOrganizationResponse> {
    const url = UrlUtil.buildUrl(this.API_URL, '/v1/mixed_companies/search', {
      api_key: this.apolloIoConfig.apiKey,
    });
    const { data } = await firstValueFrom(
      this.httpService.post<ListOrganizationResponse>(
        `${url}`,
        {
          ...query,
          per_page: query.per_page ?? this.DEFAULT_PAGE_SIZE,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    return data;
  }

  private async enrichOrganizations(organizations: Organization[]): Promise<EnrichedOrganization[]> {
    return await Promise.all(organizations.map(({ primary_domain }) => this.getEnrichedOrganization(primary_domain)));
  }

  private async getEnrichedOrganization(domain: string): Promise<EnrichedOrganization> {
    const url = UrlUtil.buildUrl(this.API_URL, '/v1/organizations/enrich', {
      domain,
      api_key: this.apolloIoConfig.apiKey,
    });

    const { data } = await firstValueFrom(
      this.httpService.get<GetEnrichedOrganizationResponse>(`${url}`, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    return data.organization;
  }
}
