import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTopicDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parentTopicId?: number;
}
