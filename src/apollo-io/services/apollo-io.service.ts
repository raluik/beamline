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
  ) {}

  public async listOrganizations(
    query: Pick<ListOrganizationQuery, 'organization_locations' | 'q_organization_keyword_tags'>,
  ): Promise<AppCompanyDto[]> {
    const organizations = await this.getOrganizations(query);
    const organizationsWithDomains = organizations.filter((organization) => organization.primary_domain);
    const enrichedOrganizations = await this.enrichOrganizations(organizationsWithDomains);

    return enrichedOrganizations.map(
      (organization) =>
        new AppCompanyDto({
          ...organization,
          seoDescription: organization.seo_description,
          shortDescription: organization.short_description,
        }),
    );
  }

  private async getOrganizations(
    query: Pick<ListOrganizationQuery, 'organization_locations' | 'q_organization_keyword_tags'>,
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
