import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [PaymentsModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
