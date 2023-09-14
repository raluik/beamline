import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AppListCompanyQueryDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  public readonly locations?: string[];

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  public readonly keywords?: string[];
}
