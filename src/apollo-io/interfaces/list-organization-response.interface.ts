import { Organization } from './organization.interface';

export interface ListOrganizationResponse {
  readonly breadcrumbs: unknown[];
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
  readonly organizations: Organization[];
}
