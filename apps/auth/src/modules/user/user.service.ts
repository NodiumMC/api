import { Injectable } from '@nestjs/common'
import { nanoid } from 'nanoid'
import { PrismaService } from '@app/common'
import { Integration } from '../../types/integration'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromIntegration(some: Integration) {
    const exists = !!(await this.prisma.user.count({
      where: {
        integrations: { some },
      },
    }))
    if (!exists) {
      await this.prisma.user.create({
        data: {
          nid: nanoid(),
          integrations: { create: [some] },
        },
      })
    }
    return this.prisma.user.findFirstOrThrow({
      where: {
        integrations: { some },
      },
    })
  }
}
