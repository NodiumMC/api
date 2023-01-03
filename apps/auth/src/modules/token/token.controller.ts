import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { TokenService } from './token.service'
import { UnauthorizedBridgeException } from '@app/common'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern({ token: 'refresh' })
  async refresh([id, token]: [string, string]) {
    const newPair = await this.tokenService.generateTokenPair(id)
    const exists = await this.tokenService.hasToken(token)
    if (!exists) throw new UnauthorizedBridgeException()
    await this.tokenService.updateToken(token, newPair.refreshToken)
    return newPair
  }

  @MessagePattern({ token: 'remove' })
  async remove(token: string) {
    const exists = await this.tokenService.hasToken(token)
    if (!exists) throw new UnauthorizedBridgeException()
    await this.tokenService.removeToken(token)
    return true
  }

  @MessagePattern({ token: 'removeAll' })
  async removeAll(id: string) {
    await this.tokenService.removeAllTokens(id)
    return true
  }
}
