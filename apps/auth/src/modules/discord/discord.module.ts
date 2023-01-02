import { Module } from '@nestjs/common'
import { DiscordController } from './discord.controller'
import { DiscordService } from './discord.service'
import { HttpModule } from '@nestjs/axios'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule, HttpModule],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
