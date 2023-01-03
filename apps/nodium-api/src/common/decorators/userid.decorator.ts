import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserId = createParamDecorator((_: undefined, context: ExecutionContext): number => {
  const request = context.switchToHttp().getRequest()
  const user = request.user
  return user.sub
})
