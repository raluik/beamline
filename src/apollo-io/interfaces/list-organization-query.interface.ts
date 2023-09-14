export interface ListOrganizationQuery {
  readonly organization_locations?: string[];
  readonly q_organization_keyword_tags?: string[];
  readonly page?: number;
  readonly per_page?: number;
}
