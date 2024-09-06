import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

enum ResourceType {
  Video = 'video',
  Article = 'article',
  PDF = 'pdf',
}

export class CreateResourceDto {
  @IsNumber()
  @IsNotEmpty()
  topicId: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  type: ResourceType;
}
