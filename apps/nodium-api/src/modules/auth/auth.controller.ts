import { BadRequestException, Controller, Delete, Get, Inject, Put, Query, Res, UseGuards } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response } from 'express'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { DiscordLoginDto } from './dto/discord-login.dto'
import { TokenPair } from '@app/common'
import { Public, User, UserId } from '../../common/decorators'
import { RtGuard } from '../../common/guards'

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Public()
  @UseGuards(RtGuard)
  @Put('refresh')
  refresh(@UserId() id: string, @User('token') token: string) {
    return this.client.send<TokenPair>({ token: 'refresh' }, [id, token])
  }

  @Public()
  @UseGuards(RtGuard)
  @Delete('logout')
  async logout(@User('token') token: string) {
    await lastValueFrom(this.client.send<TokenPair>({ token: 'remove' }, token))
  }

  @Public()
  @Get('discord')
  async discordAuth(@Res() res: Response) {
    return res.redirect(await firstValueFrom(this.client.send<string>({ auth: 'discord', type: 'oauth_url' }, {})))
  }

  @Public()
  @Get('discord/callback')
  async discordCallback(@Res() res: Response, @Query() payload: DiscordLoginDto) {
    if (!payload.code || !payload.state) return res.redirect('ndml://auth?failed')
    try {
      const { accessToken, refreshToken } = await lastValueFrom(
        this.client.send<TokenPair>({ auth: 'discord', type: 'login' }, payload),
      )
      return res.redirect(`ndml://auth?access=${accessToken}&refresh=${refreshToken}`)
    } catch (err) {
      throw new BadRequestException(err, 'Failed to login')
    }
  }
}
