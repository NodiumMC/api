import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { PrismaModule } from '@app/common'
import { TokenController } from './token.controller'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
