import { BridgeException } from './bridge.exception'
import { HttpStatus } from '@nestjs/common'

export class UnauthorizedBridgeException extends BridgeException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, 'unauthorized')
  }
}
