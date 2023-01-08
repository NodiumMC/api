import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/common'
import { JwtService } from '@nestjs/jwt'
import { TokenPair } from './types'

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async addToken(userId: string, token: string) {
    await this.prisma.token.create({
      data: {
        userId,
        token,
      },
    })
  }

  async hasToken(token: string) {
    return !!(await this.prisma.token.count({
      where: { token },
    }))
  }

  async updateToken(oldRt: string, newRt: string) {
    await this.prisma.token.update({
      where: {
        token: oldRt,
      },
      data: {
        token: newRt,
      },
    })
  }

  async removeToken(token: string) {
    await this.prisma.token.delete({
      where: {
        token,
      },
    })
  }

  async removeAllTokens(userId: string) {
    await this.prisma.token.deleteMany({
      where: {
        userId,
      },
    })
  }

  async generateTokenPair(sub: string): Promise<TokenPair> {
    const payload = { sub }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.AUTH_JWT_AT_SECRET,
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.AUTH_JWT_RT_SECRET,
        expiresIn: '14d',
      }),
    ])

    return { accessToken, refreshToken }
  }
}
