import { BadRequestException, Controller, Get, Query, Res } from '@nestjs/common'
import { Public } from '../../common/decorators'
import { Response } from 'express'
import { firstValueFrom } from 'rxjs'
import { DiscordLoginDto } from './dto/discord-login.dto'
import { DiscordService } from './discord.service'
import { IntegrationType } from '@prisma/client'
import { TokenService } from './token.service'
import { UserService } from './user.service'

@Controller('auth/discord')
export class DiscordController {
  constructor(
    private readonly discordService: DiscordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Get()
  async discordAuth(@Res() res: Response) {
    return res.redirect(this.discordService.generateOAuthUrl())
  }

  @Public()
  @Get('callback')
  async discordCallback(@Res() res: Response, @Query() payload: DiscordLoginDto) {
    if (!payload.code || !payload.state) return res.redirect('ndml:////auth?failed')
    try {
      const grant = await firstValueFrom(this.discordService.exchangeCode(payload.code, payload.state))
      const discordUser = await firstValueFrom(this.discordService.getDiscordUser(grant.access_token))
      const user = await this.userService.createFromIntegration({ type: IntegrationType.DISCORD, iid: discordUser.id })
      const tokens = await this.tokenService.generateTokenPair(user.id)
      const existsRefresh = await this.tokenService.getValidTokenOfUser(user.id)
      if (!existsRefresh) await this.tokenService.addToken(user.id, tokens.refreshToken)
      await this.userService.updateLastLogin(user.id)
      return res.redirect(`ndml:///auth?access=${tokens.accessToken}&refresh=${existsRefresh ?? tokens.refreshToken}`)
    } catch (err) {
      throw new BadRequestException(err, 'Failed to login')
    }
  }
}
