import { Controller, Get, HttpException, Inject, Query, Res } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response } from 'express'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { DiscordLoginDto } from './dto/discord-login.dto'

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Get('discord')
  async discordAuth(@Res() res: Response) {
    return res.redirect(await firstValueFrom(this.client.send<string>({ auth: 'discord', type: 'oauth_url' }, {})))
  }

  @Get('discord/callback')
  async discordCallback(@Res() res: Response, @Query() payload: DiscordLoginDto) {
    if (!payload.code || !payload.state) return res.redirect('ndml://auth?failed')
    try {
      await lastValueFrom(this.client.send({ auth: 'discord', type: 'login' }, payload))
    } catch (cause) {
      throw new HttpException({ message: 'Failed to login', cause }, 400)
    }
    return res.status(204)
  }
}
