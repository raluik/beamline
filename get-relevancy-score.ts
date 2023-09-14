import { OpenAiService } from "./open-ai-service";

const chat = new OpenAiService();

export type CompanyData = {
  name: string,
  industry: string,
  country: string,
  seo: string,
  description: string,
}

export type CompanyRelevancyResult = CompanyData & {
  score: number,
  explanation: string,
}

const CHARACTER_LIMIT = 2000;

function getCompanyDataCountWithCharacterLimit(companies: CompanyData[], characterLimit: number): number {
  // try to fit as many companies as possible into the character limit
  for (let i = 0; i < companies.length; i++) {
    if (JSON.stringify(companies.slice(0, i + 1)).length > characterLimit) {
      return i + 1;
    }
  }
  throw new Error(`Failed to find a company count that fits into the character limit of ${characterLimit}`);
}



export async function getRelevancyScores(companies: CompanyData[], keywords: string[]): Promise<CompanyRelevancyResult[]> {
  const QUESTION_PREFIX = `
We are an investment fund looking to invest $100k-$1m size tickets into promising green-tech startups in Europe.
Please rate the following startups with a integer score from 0-100 based on how well it might fit our investment criteria.
Our investment batches so far have included themes such as: ${keywords.join(', ')}.
Please also include a short explanation for each score.
Please output the data in the following (Valid!) JSON format: [{ "name": "Company A", "score": 50, "explanation": "The company uses..." }]
The company data is as follows:
`
  const remainingCharacters = CHARACTER_LIMIT - QUESTION_PREFIX.length;

  let results: CompanyRelevancyResult[] = [];
  while (results.length < companies.length) {
    const companyCount = getCompanyDataCountWithCharacterLimit(companies.slice(results.length), remainingCharacters);
    const selectedCompanies = companies.slice(results.length, results.length + companyCount);
    const question = QUESTION_PREFIX + JSON.stringify(selectedCompanies);
    console.log('\n########################## QUESTION ########################## for:', selectedCompanies.map(c => c.name).join(', '));
    console.log(question);
    const answer = await chat.getAnswer(question);
    console.log('\n########################## ANSWER ##########################');
    console.log(JSON.stringify(answer, null, 2));
    try {
      const parsed = JSON.parse(answer);
      results = results.concat(selectedCompanies.map((c, i) => ({
        ...c,
        score: parsed[i].score,
        explanation: parsed[i].explanation,
      })));
    } catch(e) {
      console.error('Failed to parse answer:', answer, e);
    }
  }
  return results;
}
