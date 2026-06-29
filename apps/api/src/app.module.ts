import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { NetworkModule } from './modules/network/network.module';
import { DnsModule } from './modules/dns/dns.module';
import { SslModule } from './modules/ssl/ssl.module';
import { DevModule } from './modules/dev/dev.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: parseInt(process.env.RATE_LIMIT || '60', 10),
      },
    ]),
    NetworkModule,
    DnsModule,
    SslModule,
    DevModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
