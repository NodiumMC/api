import { Controller, Delete, Put, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Public, User, UserId } from '../../common/decorators'
import { RtGuard } from '../../common/guards'
import { TokenService } from './token.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @UseGuards(RtGuard)
  @Put('refresh')
  async refresh(@UserId() id: string, @User('token') token: string) {
    const newPair = await this.tokenService.generateTokenPair(id)
    const exists = await this.tokenService.hasToken(token)
    if (!exists) throw new UnauthorizedException()
    await this.tokenService.updateToken(token, newPair.refreshToken)
    return newPair
  }

  @Public()
  @UseGuards(RtGuard)
  @Delete('logout')
  async logout(@User('token') token: string) {
    const exists = await this.tokenService.hasToken(token)
    if (!exists) throw new UnauthorizedException()
    await this.tokenService.removeToken(token)
    return true
  }
}
