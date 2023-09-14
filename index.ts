const APOLLO_IO_API_URL = "https://api.apollo.io";
const APOLLO_IO_API_KEY = "";

const ORGANIZATION_LOCATIONS = ["Estonia"];
const ORGANIZATION_KEYWORDS = ["sustainability"];

const DEFAULT_PAGE_SIZE = 2;
const PAGE_LIMIT = 1;

async function init(): Promise<void> {
  const organizations = await getOrganizations();

  const organizationsWithDomains = organizations.filter(
    (organization) => organization.primary_domain
  );

  const enrichedOrganizations = await enrichOrganizations(
    organizationsWithDomains
  );
}

async function getOrganizations(): Promise<OrganizationDto[]> {
  const organizations: OrganizationDto[] = [];

  let response: ListOrganizationResponseDto | null = null;
  do {
    response = await listOrganizations({
      organization_locations: ORGANIZATION_LOCATIONS,
      q_organization_keyword_tags: ORGANIZATION_KEYWORDS,
      page: response?.pagination ? response.pagination.page + 1 : 1,
    });

    organizations.push(...response.organizations);
  } while (
    response.pagination.page < response.pagination.total_pages &&
    response.pagination.page < PAGE_LIMIT
  );

  return organizations;
}

async function listOrganizations(
  query: ListOrganizationQueryDto
): Promise<ListOrganizationResponseDto> {
  const response = await fetch(
    buildUrl("/v1/mixed_companies/search", {
      api_key: APOLLO_IO_API_KEY,
    }),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...query,
        per_page: query.per_page ?? DEFAULT_PAGE_SIZE,
      }),
    }
  );

  return await response.json();
}

async function enrichOrganizations(
  organizations: OrganizationDto[]
): Promise<EnrichedOrganizationDto[]> {
  const enrichedOrganizations: EnrichedOrganizationDto[] = [];

  for (let { primary_domain } of organizations) {
    const enrichedOrganization = await getEnrichedOrganization(primary_domain);
    enrichedOrganizations.push(enrichedOrganization);
  }

  return enrichedOrganizations;
}

async function getEnrichedOrganization(
  domain: string
): Promise<EnrichedOrganizationDto> {
  const response = await fetch(
    buildUrl("/v1/organizations/enrich", {
      domain,
      api_key: APOLLO_IO_API_KEY,
    }),
    { headers: { "Content-Type": "application/json" } }
  );

  const { organization }: GetEnrichedOrganizationResponseDto =
    await response.json();

  return organization;
}

function buildUrl(
  path: string,
  query: Readonly<Record<string, unknown>> = {}
): URL {
  const url = new URL(path, APOLLO_IO_API_URL);

  Object.entries(query).forEach(([key, value]) =>
    url.searchParams.append(key, encodeURIComponent(`${value}`))
  );

  return url;
}

init();

class ListOrganizationQueryDto {
  readonly organization_locations?: string[];
  readonly q_organization_keyword_tags?: string[];
  readonly page?: number;
  readonly per_page?: number;
}

class ListOrganizationResponseDto {
  readonly breadcrumbs: [];
  readonly partial_results_only: boolean;
  readonly disable_eu_prospecting: boolean;
  readonly partial_results_limit: number;
  readonly pagination: {
    readonly page: number;
    readonly per_page: number;
    readonly total_entries: number;
    readonly total_pages: number;
  };
  readonly num_fetch_result: null;
  readonly model_ids: string[];
  readonly organizations: OrganizationDto[];
}

class OrganizationDto {
  readonly id: string;
  readonly name: string;
  readonly website_url: string;
  readonly blog_url: string | null;
  readonly angellist_url: string | null;
  readonly linkedin_url: string;
  readonly twitter_url: string;
  readonly facebook_url: string;
  readonly primary_phone: Array<{
    readonly number: string;
    readonly source: string;
  }>;
  readonly languages: string[];
  readonly alexa_ranking: number;
  readonly phone: string;
  readonly linkedin_uid: string;
  readonly founded_year: number;
  readonly publicly_traded_symbol: string;
  readonly publicly_traded_exchange: string;
  readonly logo_url: string;
  readonly crunchbase_url: string | null;
  readonly primary_domain: string;
  readonly sanitized_phone: string;
  readonly market_cap: string;
  readonly industry: string;
  readonly keywords: string[];
  readonly estimated_num_employees: number;
  readonly industries: string[];
  readonly secondary_industries: string[];
  readonly snippets_loaded: boolean;
  readonly industry_tag_id: string;
  readonly industry_tag_hash: [Object];
  readonly retail_location_count: number;
  readonly raw_address: string;
  readonly street_address: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly postal_code: null;
  readonly intent_strength: null;
  readonly show_intent: boolean;
}

class GetEnrichedOrganizationResponseDto {
  readonly organization: EnrichedOrganizationDto;
}

class EnrichedOrganizationDto extends OrganizationDto {
  readonly persona_counts: {};
  readonly owned_by_organization_id: null;
  readonly suborganizations: [];
  readonly num_suborganizations: number;
  readonly seo_description: string;
  readonly short_description: string;
  readonly annual_revenue_printed: string;
  readonly annual_revenue: number;
  readonly total_funding: number;
  readonly total_funding_printed: string;
  readonly latest_funding_round_date: string;
  readonly latest_funding_stage: string;
  readonly funding_events: [
    {
      readonly id: string;
      readonly date: string;
      readonly news_url: string;
      readonly type: string;
      readonly investors: string;
      readonly amount: string;
      readonly currency: string;
    }
  ];
  readonly technology_names: string[];
  readonly current_technologies: Array<{
    readonly uid: string;
    readonly name: string;
    readonly category: string;
  }>;
  readonly account_id: string;
  readonly account: Array<{
    readonly id: string;
    readonly domain: string;
    readonly name: string;
    readonly team_id: string;
    readonly organization_id: string;
    readonly account_stage_id: string;
    readonly source: string;
    readonly original_source: string;
    readonly owner_id: string;
    readonly created_at: string;
    readonly phone: string;
    readonly phone_status: string;
    readonly test_predictive_score: null;
    readonly hubspot_id: null;
    readonly salesforce_id: string;
    readonly crm_owner_id: string;
    readonly parent_account_id: null;
    readonly sanitized_phone: string;
    readonly account_playbook_statuses: [];
    readonly existence_level: string;
    readonly label_ids: [];
    readonly typed_custom_fields: {};
    readonly modality: string;
    readonly persona_counts: {};
  }>;
  readonly departmental_head_count: {
    readonly engineering: number;
    readonly accounting: number;
    readonly product_management: number;
    readonly support: number;
    readonly arts_and_design: number;
    readonly sales: number;
    readonly education: number;
    readonly consulting: number;
    readonly human_resources: number;
    readonly business_development: number;
    readonly operations: number;
    readonly finance: number;
    readonly entrepreneurship: number;
    readonly marketing: number;
    readonly information_technology: number;
    readonly administrative: number;
    readonly legal: number;
    readonly media_and_commmunication: number;
    readonly data_science: number;
  };
}
