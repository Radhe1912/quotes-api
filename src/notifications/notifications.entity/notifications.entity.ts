import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity/users.entity';

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'time' })
    time: string;

    @Column({ default: 'daily' })
    frequency: string;

    @ManyToOne(() => UsersEntity, (user) => user.notifications, {
        onDelete: 'CASCADE',
    })
    user: UsersEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
