export type CompanyData = {
  name: string;
  industry: string;
  country: string;
  seo: string;
  description: string;
  logo: string;
  website: string;
  shortDescription: string;
};

export type CompanyRelevancyResult = CompanyData & {
  score: number;
  explanation: string;
};