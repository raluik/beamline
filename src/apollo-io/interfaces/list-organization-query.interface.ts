export interface ListOrganizationQuery {
  readonly organization_locations?: string[];
  readonly q_organization_keyword_tags?: string[];
  readonly organization_num_employees_ranges?: string;
  readonly page?: number;
  readonly per_page?: number;
}
