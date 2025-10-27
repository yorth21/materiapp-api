import { IsOptional, IsString, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRecommendationsDto {
  @IsString()
  @IsIn(['A', 'B'])
  currentSemester: 'A' | 'B';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(25)
  @Type(() => Number)
  maxCredits?: number = 18;

  @IsOptional()
  @IsString()
  @IsIn(['morning', 'afternoon', 'evening', 'any'])
  preferredSchedule?: 'morning' | 'afternoon' | 'evening' | 'any' = 'any';

  @IsOptional()
  includeElectives?: boolean = true;
}
