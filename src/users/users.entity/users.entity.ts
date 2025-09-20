import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { QuotesEntity } from '../../quotes/quotes.entity/quotes.entity';
import { NotificationEntity } from '../../notifications/notifications.entity/notifications.entity';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @OneToMany(() => QuotesEntity, (quote) => quote.createdBy)
    quotes: QuotesEntity[];

    @OneToMany(() => NotificationEntity, (notification) => notification.user)
    notifications: NotificationEntity[];
}
