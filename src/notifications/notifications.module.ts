import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notifications.entity/notifications.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from '../users/users.module';
import { UsersEntity } from 'src/users/users.entity/users.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { QuotesEntity } from '../quotes/quotes.entity/quotes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UsersEntity, QuotesEntity]), UsersModule, ScheduleModule.forRoot()],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
