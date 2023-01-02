import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { IntegrationType } from '@prisma/client'
import { firstValueFrom } from 'rxjs'
import { UserService } from '../user/user.service'
import { DiscordService } from './discord.service'
import { LoginDto } from './dto/login.dto'

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService, private readonly userService: UserService) {}

  @MessagePattern({ auth: 'discord', type: 'oauth_url' })
  oauth() {
    return this.discordService.generateOAuthUrl()
  }

  @MessagePattern({ auth: 'discord', type: 'login' })
  async login({ code, state }: LoginDto) {
    const grant = await firstValueFrom(this.discordService.exchangeCode(code, state))
    const user = await firstValueFrom(this.discordService.getDiscordUser(grant.access_token))
    await this.userService.createFromIntegration({ type: IntegrationType.DISCORD, iid: user.id })
    return true
  }
}
