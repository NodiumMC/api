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
        transport: Transport.TCP,
        options: { port: 3201 },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AtStrategy, RtStrategy],
})
export class AuthModule {}
