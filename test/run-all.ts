import { getCompanyData } from '../get-company-data';
import { CompanyData, getRelevancyScores } from '../get-relevancy-score';
// import { TEST_DATA } from './test-companies';
const APOLLO_SEARCH_LOCATIONS = ['Estonia'];
const APOLLO_SEARCH_KEYWORDS = ['sustainability'];
const CHAT_GPT_SEARCH_KEYWORDS = ['energy efficiency'];

(async () => {
  const companies: CompanyData[] = (await getCompanyData({ keywords: APOLLO_SEARCH_KEYWORDS, locations: APOLLO_SEARCH_LOCATIONS }))
  //const companies: CompanyData[] = TEST_DATA
  .map(c => ({
    name: c.name,
    industry: c.industry,
    country: c.country,
    seo: c.seo_description,
    description: c.short_description,
  }));
  console.log(`################# APOLLO ################# RESULTS (${companies.length}): ${companies.map(c => c.name).join(', ')}`)
  const results = await getRelevancyScores(companies, CHAT_GPT_SEARCH_KEYWORDS);
  console.log(JSON.stringify(results, null, 2));
})()