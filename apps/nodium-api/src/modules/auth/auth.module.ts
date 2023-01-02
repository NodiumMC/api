import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'

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
})
export class AuthModule {}