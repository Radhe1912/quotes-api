import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
    constructor(private readonly quotesService: QuotesService) { }

    @Post()
    async create(@Body() body: { content: string; author?: string; createdById?: string }) {
        const { content, author, createdById } = body;
        const quoteData: any = { content, author };
        if (createdById) {
            quoteData.createdBy = { id: createdById };
        }
        return this.quotesService.create(quoteData);
    }

    @Get()
    async findAll() {
        return this.quotesService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.quotesService.findById(id);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.quotesService.findByUser(userId);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: { content?: string; author?: string }) {
        return this.quotesService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.quotesService.remove(id);
    }

}
