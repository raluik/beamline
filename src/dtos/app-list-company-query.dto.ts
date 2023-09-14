import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

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

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public readonly minEmployeeCount?: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  public readonly maxEmployeeCount?: number;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  public readonly chatGptKeywords: string[];
}
