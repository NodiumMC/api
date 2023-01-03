import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './modules/discord/discord.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from '@app/common'
import { TokenModule } from './modules/token/token.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      cache: true,
    }),
    DiscordModule,
    UserModule,
    PrismaModule,
    TokenModule,
  ],
})
export class AuthModule {}
