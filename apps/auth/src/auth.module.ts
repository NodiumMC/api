import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordModule } from './modules/discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      cache: true,
    }),
    DiscordModule,
  ],
})
export class AuthModule {}
