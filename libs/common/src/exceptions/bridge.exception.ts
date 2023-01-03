import { RpcException } from '@nestjs/microservices'
import { HttpStatus } from '@nestjs/common'

export class BridgeException extends RpcException {
  constructor(status: HttpStatus, error: any) {
    super({ code: status, error })
  }
}
