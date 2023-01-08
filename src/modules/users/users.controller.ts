import { Controller, Get, Param } from '@nestjs/common'
import { Public, UserId } from '../../common/decorators'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('@me')
  async me(@UserId() id: string) {
    return this.userService.getUserById(id)
  }

  @Public()
  @Get(':nid')
  async user(@Param('nid') nid: string) {
    return this.userService.getPublicUserByNid(nid)
  }
}
