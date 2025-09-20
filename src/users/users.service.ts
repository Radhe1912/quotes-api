import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
    ) { }

    async create(user: Partial<UsersEntity>) {
        const existing = await this.usersRepository.findOne({
            where: { email: user.email },
        });

        if (existing) {
            throw new BadRequestException('Email already registered');
        }

        return this.usersRepository.save(user);
    }

    async findUser(email: string, password: string) {
        return this.usersRepository.findOne({ where: { email, password } });
    }

    async findById(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }
}
