import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesEntity } from './quotes.entity/quotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotesEntity])],
  controllers: [QuotesController],
  providers: [QuotesService]
})
export class QuotesModule {}
