import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AtStrategy } from './strategies/at.strategy'
import { RtStrategy } from './strategies/rt.strategy'
import { PrismaModule } from '@app/common'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'
import { TokenService } from './token.service'
import { DiscordService } from './discord.service'
import { UserService } from './user.service'
import { DiscordController } from './discord.controller'

@Module({
  imports: [PrismaModule, JwtModule.register({}), HttpModule],
  controllers: [AuthController, DiscordController],
  providers: [AtStrategy, RtStrategy, TokenService, DiscordService, UserService],
})
export class AuthModule {}
