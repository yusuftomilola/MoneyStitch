import { forwardRef, Global, Module } from '@nestjs/common';
import { BaseGateway } from './base.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [],
  controllers: [],
  exports: [],
})
export class GatewaysModule {}
