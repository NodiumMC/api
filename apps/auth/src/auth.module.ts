import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './modules/discord/discord.module'
import { UserModule } from './modules/user/user.module'
import { PrismaModule } from './modules/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      cache: true,
    }),
    DiscordModule,
    UserModule,
    PrismaModule,
  ],
})
export class AuthModule {}
