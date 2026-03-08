import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';

interface MercadoPagoWebhookBody {
  type?: string;
  action?: string;
  data?: { id: string | number };
}

interface MercadoPagoWebhookQuery {
  type?: string;
  'data.id'?: string;
}

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mp')
  @HttpCode(200)
  async handleMercadoPago(
    @Body() body: MercadoPagoWebhookBody,
    @Query() query: MercadoPagoWebhookQuery,
  ) {
    // O MP envia type e data.id tanto no body quanto nos query params
    const type = body.type ?? query.type;
    const paymentId = body.data?.id ? String(body.data.id) : query['data.id'];

    this.logger.log(
      `Webhook recebido | type: ${type} | id: ${paymentId ?? 'n/a'}`,
    );

    if (type === 'payment' && paymentId) {
      try {
        const status = await this.paymentsService.getPaymentStatus(paymentId);
        this.logger.log(`Pagamento ${paymentId}: ${status.status}`);
      } catch {
        this.logger.warn(`Não foi possível consultar pagamento ${paymentId}`);
      }
    }

    // MP espera 200 em até 22s, caso contrário retentará
    return { received: true };
  }
}
