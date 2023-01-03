import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { IntegrationType } from '@prisma/client'
import { firstValueFrom } from 'rxjs'
import { UserService } from '../user/user.service'
import { DiscordService } from './discord.service'
import { LoginDto } from './dto/login.dto'
import { TokenService } from '../token/token.service'
import { TokenPair } from '@app/common'

@Controller('discord')
export class DiscordController {
  constructor(
    private readonly discordService: DiscordService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @MessagePattern({ auth: 'discord', type: 'oauth_url' })
  oauth() {
    return this.discordService.generateOAuthUrl()
  }

  @MessagePattern({ auth: 'discord', type: 'login' })
  async login({ code, state }: LoginDto): Promise<TokenPair> {
    const grant = await firstValueFrom(this.discordService.exchangeCode(code, state))
    const discordUser = await firstValueFrom(this.discordService.getDiscordUser(grant.access_token))
    const user = await this.userService.createFromIntegration({ type: IntegrationType.DISCORD, iid: discordUser.id })
    const tokens = await this.tokenService.generateTokenPair(user.id)
    await this.tokenService.addToken(user.id, tokens.refreshToken)
    return tokens
  }
}
