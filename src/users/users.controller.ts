import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity/users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('register')
    async register(@Body() body: { name: string; email: string; password: string }) {
        if (!body.name || !body.email || !body.password) {
            throw new Error('Name, email, and password are required');
        }

        if (body.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        const existing = await this.usersService.findByEmail(body.email);
        if (existing) {
            throw new Error('Email already exists');
        }

        const user = await this.usersService.create(body);
        return { id: user.id, name: user.name, email: user.email };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        if (!body.email || !body.password) {
            throw new Error('Email and password are required');
        }

        const user = await this.usersService.findUser(body.email, body.password);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        return { id: user.id, name: user.name, email: user.email };
    }
}
