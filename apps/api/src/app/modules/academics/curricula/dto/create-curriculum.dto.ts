import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCurriculumDto {
  @IsString()
  @Length(1, 20)
  version: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsInt()
  @IsNotEmpty()
  programId: number;
}
