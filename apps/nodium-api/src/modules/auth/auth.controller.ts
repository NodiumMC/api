import { Controller, Get, Inject, Query, Res } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Response } from 'express'
import { firstValueFrom } from 'rxjs'

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Get('discord')
  async discordAuth(@Res() res: Response) {
    return res.redirect(
      await firstValueFrom(this.client.send<string>({ type: 'discord' }, {})),
    )
  }

  @Get('discord/callback')
  async discordCallback(@Query('code') code: string) {
    return { code }
  }
}
