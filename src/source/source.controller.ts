import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SourceService } from './source.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get('/my-secret-path/create-sources')
  createDummySources() {
    return this.sourceService.createDummySources();
  }

  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourceService.create(createSourceDto);
  }

  @Get()
  findAll() {
    return this.sourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourceService.update(+id, updateSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sourceService.remove(+id);
  }

}
