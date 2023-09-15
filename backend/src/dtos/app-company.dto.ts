import { Expose, plainToInstance } from 'class-transformer';
import { CompanyData } from 'src/open-ai/services';

export class AppCompanyDto implements CompanyData {
  @Expose()
  public readonly name: string;

  @Expose()
  public readonly industry: string;

  @Expose()
  public readonly country: string;

  @Expose()
  public readonly seo: string;

  @Expose()
  public readonly description: string;

  @Expose()
  public readonly score: number;

  @Expose()
  public readonly explanation: string;

  public constructor(args: AppCompanyDto) {
    Object.assign(this, plainToInstance(AppCompanyDto, args, { excludeExtraneousValues: true }));
  }
}
