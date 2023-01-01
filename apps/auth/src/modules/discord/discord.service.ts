import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { DiscordGrantDto } from './dto/discord-grant.dto'
import { map, Observable } from 'rxjs'

@Injectable()
export class DiscordService {
  constructor(private readonly fetch: HttpService) {}

  private get redirectUrl() {
    return process.env.ORIGIN + '/auth/discord/callback'
  }

  generateOAuthUrl() {
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${this.redirectUrl}&response_type=code&scope=identify%20email`
  }

  exchangeCode(code: string): Observable<DiscordGrantDto> {
    return this.fetch
      .post<DiscordGrantDto>(
        'https://discord.com/api/oauth2/token',
        {
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUrl,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((o) => o.data))
  }
}
