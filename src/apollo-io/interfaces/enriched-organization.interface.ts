import { Organization } from './organization.interface';

export interface EnrichedOrganization extends Organization {
  readonly persona_counts: Readonly<Record<string, unknown>>;
  readonly owned_by_organization_id: null;
  readonly suborganizations: unknown[];
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
    },
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
    readonly account_playbook_statuses: unknown[];
    readonly existence_level: string;
    readonly label_ids: unknown[];
    readonly typed_custom_fields: Readonly<Record<string, unknown>>;
    readonly modality: string;
    readonly persona_counts: Readonly<Record<string, unknown>>;
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
