export type CompanyData = {
  name: string;
  industry: string;
  country: string;
  seo: string;
  description: string;
};

export type CompanyRelevancyResult = CompanyData & {
  score: number;
  explanation: string;
};