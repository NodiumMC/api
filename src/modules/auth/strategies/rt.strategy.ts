import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_JWT_RT_SECRET,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: any) {
    const token = req?.get?.('authorization')?.split?.(' ')?.[1]

    if (!token) throw new ForbiddenException('Refresh token malformed or missing')

    return {
      ...payload,
      token,
    }
  }
}
