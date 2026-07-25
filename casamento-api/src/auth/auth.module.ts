import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminGuard } from './admin.guard';

// Global para que o AdminGuard e o AuthService fiquem disponíveis aos demais
// módulos (rsvp, letters) sem precisar reimportar AuthModule em cada um.
@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AdminGuard],
  exports: [AuthService, AdminGuard],
})
export class AuthModule {}
