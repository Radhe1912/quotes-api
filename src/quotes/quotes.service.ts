import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotesEntity } from './quotes.entity/quotes.entity';

@Injectable()
export class QuotesService {
    constructor(
        @InjectRepository(QuotesEntity)
        private readonly quotesRepository: Repository<QuotesEntity>,
    ) { }

    async create(quote: Partial<QuotesEntity>) {
        return this.quotesRepository.save(quote);
    }

    async update(id: string, data: Partial<QuotesEntity>) {
        const quote = await this.findById(id);
        Object.assign(quote, data);
        return this.quotesRepository.save(quote);
    }

    async findAll() {
        return this.quotesRepository.find({
            relations: ['createdBy'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string) {
        const quote = await this.quotesRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!quote) throw new NotFoundException('Quote not found');
        return quote;
    }

    async findByUser(userId: string) {
        return this.quotesRepository.find({
            where: { createdBy: { id: userId } },
            relations: ['createdBy'],
        });
    }

    async remove(id: string) {
        const result = await this.quotesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Quote not found');
        }
        return { deleted: true };
    }

}
