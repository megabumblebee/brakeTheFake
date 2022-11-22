import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {NewsService} from './news.service';
import {CreateNewsDto} from './dto/create-news.dto';
import {UpdateNewsDto} from './dto/update-news.dto';
import {Roles} from "../decorators/roles.decorator";
import {Role} from "../user/role.enum";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../guards/roles.guard";

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('my-secret-path/force-download')
  downloadFeed() {
    return this.newsService.downloadFeed();
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('my-secret-path/force-update-sources')
  updateSources() {
    return this.newsService.updateSourceFactor();
  }

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/')
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

}
