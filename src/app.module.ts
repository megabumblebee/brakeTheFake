import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import {databaseOptions} from "./config/db.config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { CategoryModule } from './category/category.module';
import { SourceModule } from './source/source.module';
import { InformationModule } from './information/information.module';
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...databaseOptions
    }),
    UserModule,
    AuthModule,
    NewsModule,
    CategoryModule,
    SourceModule,
    InformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
