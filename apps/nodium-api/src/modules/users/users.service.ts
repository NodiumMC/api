import { Injectable } from '@nestjs/common'
import { PrismaService } from '@app/common'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        nid: true,
        username: true,
        createdAt: true,
        lastLoginAt: true,
        integrations: {
          select: {
            type: true,
            iid: true,
          },
        },
      },
    })
  }

  async getPublicUserByNid(nid: string) {
    return this.prisma.user.findUnique({
      where: {
        nid,
      },
      select: {
        nid: true,
        username: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })
  }
}
