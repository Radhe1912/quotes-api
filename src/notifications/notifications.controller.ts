import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    async create(@Body() body: { userId: string; time: string; frequency: string }) {
        return this.notificationsService.create(body.userId, body.time, body.frequency);
    }

    @Get('user/:id')
    async findByUser(@Param('id') id: string) {
        return this.notificationsService.findByUser(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.notificationsService.remove(id);
    }
}
