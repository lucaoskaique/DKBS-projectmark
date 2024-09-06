import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }

  @Get(':id/versions')
  getTopicVersions(@Param('id') id: string) {
    return this.topicsService.getTopicVersions(+id);
  }

  @Get(':id/version/:version')
  findSpecificVersion(
    @Param('id') id: string,
    @Param('version') version: string,
  ) {
    return this.topicsService.findSpecificVersion(+id, +version);
  }

  @Get(':id/tree')
  async getTopicTree(@Param('id') id: string) {
    return this.topicsService.getTopicTree(+id);
  }
}
