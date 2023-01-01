import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { DiscordService } from './discord.service'

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @MessagePattern({ type: 'discord' })
  auth() {
    return this.discordService.generateOAuthUrl()
  }
}
