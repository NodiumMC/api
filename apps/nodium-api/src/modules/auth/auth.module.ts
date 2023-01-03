import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AtStrategy } from './strategies/at.strategy'
import { RtStrategy } from './strategies/rt.strategy'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        transport: Transport.TCP,
        options: {
          host: process.env?.MICROSERVICE_AUTH_HOST ?? '0.0.0.0',
          port: process.env?.MICROSERVICE_AUTH_PORT ?? 3201,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AtStrategy, RtStrategy],
})
export class AuthModule {}
