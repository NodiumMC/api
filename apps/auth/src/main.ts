import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module'
import { Transport } from '@nestjs/microservices'
import { ConsoleLogger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    logger: new ConsoleLogger('Auth'),
    options: {
      host: '0.0.0.0',
      port: 3201,
    },
  })
  await app.listen()
}

bootstrap()
