import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notifications.entity/notifications.entity';
import { UsersEntity } from '../users/users.entity/users.entity';
import { QuotesEntity } from '../quotes/quotes.entity/quotes.entity';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  private transporter;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepo: Repository<NotificationEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepo: Repository<UsersEntity>,
    @InjectRepository(QuotesEntity)
    private readonly quotesRepo: Repository<QuotesEntity>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
  }

  async create(userId: string, time: string, frequency: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const notification = this.notificationRepo.create({ time, frequency, user });
    const saved = await this.notificationRepo.save(notification);

    return saved;
  }

  async findByUser(userId: string) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async remove(id: string) {
    await this.notificationRepo.delete(id);
    return { deleted: true };
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: '"Daily Inspiration" <radhe19professional@gmail.com>',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`❌ Failed to send email`, error);
    }
  }

  private createEmailTemplate(userName: string, quote: any): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily Inspiration</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .quote {
            font-size: 20px;
            font-style: italic;
            line-height: 1.6;
            color: #444;
            text-align: center;
            margin-bottom: 30px;
            padding: 0 20px;
            border-left: 4px solid #667eea;
        }
        .author {
            text-align: right;
            font-size: 16px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 40px;
        }
        .greeting {
            text-align: center;
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .icon {
            font-size: 24px;
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Daily Inspiration</h1>
        </div>
        <div class="content">
            <div class="greeting">
                <p>Hello ${userName},</p>
                <p>Here's your daily quote of inspiration:</p>
            </div>
            
            <div class="quote">
                "${quote?.content || 'The best preparation for tomorrow is doing your best today.'}"
            </div>
            
            <div class="author">
                — ${quote?.author || 'H. Jackson Brown Jr.'}
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="button">
                    Explore More Quotes
                </a>
            </div>
        </div>
        <div class="footer">
            <p>You're receiving this email because you subscribed to daily inspirational quotes.</p>
            <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/notifications">Manage your notifications</a> | <a href="#">Unsubscribe</a></p>
            <p>© ${new Date().getFullYear()} Daily Inspiration. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  @Cron('* * * * *')
  async handleCron() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const notifications = await this.notificationRepo.find({
      relations: ['user'],
    });

    const notifiedUsers = new Set<string>();

    for (const notification of notifications) {
      const notificationTime = notification.time.slice(0, 5);

      if (notificationTime === currentTime && !notifiedUsers.has(notification.user.id)) {
        try {
          notifiedUsers.add(notification.user.id);

          const randomQuote = await this.quotesRepo
            .createQueryBuilder('quote')
            .orderBy('RANDOM()')
            .getOne();

          // Create beautiful HTML email
          const htmlContent = this.createEmailTemplate(
            notification.user.name,
            randomQuote
          );

          // Send email
          await this.sendEmail(
            notification.user.email,
            '✨ Your Daily Dose of Inspiration',
            htmlContent
          );

        } catch (error) {
          console.error(`❌ Error sending email to ${notification.user.email}:`, error);
        }
      }
    }
  }
}