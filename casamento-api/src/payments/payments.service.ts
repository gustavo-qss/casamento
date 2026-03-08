import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private mp: MercadoPagoConfig;

  constructor(private config: ConfigService) {
    this.mp = new MercadoPagoConfig({
      accessToken: this.config.getOrThrow<string>('MP_ACCESS_TOKEN'),
    });
  }

  async createPreference(dto: CreatePreferenceDto) {
    const preference = new Preference(this.mp);
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const backendUrl = this.config.getOrThrow<string>('BACKEND_URL');

    // Com credenciais de produção (APP_USR-), o MP rejeita back_urls e
    // notification_url com localhost/http. Só enviamos quando as URLs forem públicas.
    const frontendIsPublic =
      frontendUrl.startsWith('https://') &&
      !frontendUrl.includes('localhost') &&
      !frontendUrl.includes('127.0.0.1');

    const backendIsPublic =
      backendUrl.startsWith('https://') &&
      !backendUrl.includes('localhost') &&
      !backendUrl.includes('127.0.0.1');

    const body = {
      items: dto.items.map((item, index) => ({
        id: String(index + 1),
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'BRL',
      })),
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      ...(frontendIsPublic && {
        back_urls: {
          success: `${frontendUrl}?payment=success`,
          failure: `${frontendUrl}?payment=failure`,
          pending: `${frontendUrl}?payment=pending`,
        },
        auto_return: 'approved',
      }),
      ...(backendIsPublic && {
        notification_url: `${backendUrl}/api/webhook/mp`,
      }),
    };

    this.logger.log(
      `Criando preferência | itens: ${dto.items.length} | back_urls: ${frontendIsPublic ? 'sim' : 'não (local)'} | notif: ${backendIsPublic ? 'sim' : 'não (local)'}`,
    );

    try {
      const result = await preference.create({ body });

      return {
        preferenceId: result.id,
        checkoutUrl: result.init_point,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`[MP] ${err.message}`);
        if ('cause' in err && err.cause !== undefined) {
          this.logger.error(`[MP cause] ${JSON.stringify(err.cause)}`);
        }
      } else {
        this.logger.error(`[MP] erro desconhecido: ${JSON.stringify(err)}`);
      }
      throw new InternalServerErrorException(
        'Falha ao criar preferência de pagamento',
      );
    }
  }

  async getPaymentStatus(paymentId: string) {
    const payment = new Payment(this.mp);

    try {
      const result = await payment.get({ id: paymentId });
      return {
        status: result.status,
        statusDetail: result.status_detail,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.error(`[MP status] ${err.message}`);
      }
      throw new InternalServerErrorException(
        'Falha ao consultar status do pagamento',
      );
    }
  }
}
