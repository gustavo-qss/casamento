import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/payments.module';
import { WebhookModule } from './webhook/webhook.module';
import { LettersModule } from './letters/letters.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PaymentsModule,
    WebhookModule,
    LettersModule,
    RsvpModule,
  ],
})
export class AppModule {}
