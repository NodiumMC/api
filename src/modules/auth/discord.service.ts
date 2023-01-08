import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { DiscordGrantDto } from './dto/discord-grant.dto'
import { catchError, map, Observable } from 'rxjs'
import { DiscordUserDto } from './dto/discord-user.dto'
import { RpcException } from '@nestjs/microservices'
import { nanoid } from 'nanoid'
import * as qs from 'qs'

@Injectable()
export class DiscordService {
  constructor(private readonly fetch: HttpService) {}

  private get redirectUrl() {
    return process.env.ORIGIN + '/auth/discord/callback'
  }

  generateOAuthUrl() {
    return `https://discord.com/api/v10/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${
      this.redirectUrl
    }&response_type=code&scope=identify%20email&state=${nanoid(6)}`
  }

  exchangeCode(code: string, state: string): Observable<DiscordGrantDto> {
    return this.fetch
      .post<DiscordGrantDto>(
        'https://discord.com/api/v10/oauth2/token',
        qs.stringify({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUrl,
          state,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      )
      .pipe(
        catchError((cause) => {
          throw new RpcException({
            message: 'Failed to grant',
            cause: cause.response?.data ?? cause.message,
          })
        }),
      )
      .pipe(map((o) => o.data))
  }

  getDiscordUser(accessToken: string) {
    return this.fetch
      .get<DiscordUserDto>('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Encoding': 'gzip,deflate,compress',
        },
      })
      .pipe(
        catchError((err) => {
          throw new RpcException({ message: 'Failed to request user', cause: err.response?.data ?? err.message })
        }),
      )
      .pipe(map((o) => o.data))
  }
}
