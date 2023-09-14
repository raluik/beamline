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

@Injectable()
export class ApolloIoService {
  private readonly API_URL = 'https://api.apollo.io';

  private readonly DEFAULT_PAGE_SIZE = 2;
  private readonly PAGE_LIMIT = 1;

  public constructor(
    @Inject(apolloIoConfigFactory.KEY) private readonly apolloIoConfig: ApolloIoConfig,
    private readonly httpService: HttpService,
    private readonly relevancyScoreService: RelevancyScoreService,
  ) {}

  public async listOrganizations(
    query: Pick<
      ListOrganizationQuery,
      'organization_locations' | 'q_organization_keyword_tags' | 'organization_num_employees_ranges'
    > & {
      readonly chatGptKeywords: string[];
    },
  ): Promise<AppCompanyDto[]> {
    const organizations = await this.getOrganizations(query);
    const organizationsWithDomains = organizations.filter((organization) => organization.primary_domain);
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
    const results = await this.relevancyScoreService.getRelevancyScores(companies, query.chatGptKeywords);
    console.log(JSON.stringify(results, null, 2));

    return results
      .sort((company1, company2) => company2.score - company1.score)
      .map((company) => new AppCompanyDto(company));
  }

  private async getOrganizations(
    query: Pick<
      ListOrganizationQuery,
      'organization_locations' | 'q_organization_keyword_tags' | 'organization_num_employees_ranges'
    >,
  ): Promise<Organization[]> {
    const organizations: Organization[] = [];

    let response: ListOrganizationResponse | null = null;
    do {
      response = await this.getOrganizationsPage({
        ...query,
        page: response?.pagination ? response.pagination.page + 1 : 1,
      });

      organizations.push(...response.organizations);
    } while (response.pagination.page < response.pagination.total_pages && response.pagination.page < this.PAGE_LIMIT);

    return organizations;
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
    const enrichedOrganizations: EnrichedOrganization[] = [];

    for (const { primary_domain } of organizations) {
      const enrichedOrganization = await this.getEnrichedOrganization(primary_domain);
      enrichedOrganizations.push(enrichedOrganization);
    }

    return enrichedOrganizations;
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
