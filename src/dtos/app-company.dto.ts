import { Expose, plainToInstance } from 'class-transformer';

export class AppCompanyDto {
  @Expose()
  public readonly name: string;

  @Expose()
  public readonly seoDescription: string;

  @Expose()
  public readonly shortDescription: string;

  public constructor(args: AppCompanyDto) {
    Object.assign(this, plainToInstance(AppCompanyDto, args, { excludeExtraneousValues: true }));
  }
}
