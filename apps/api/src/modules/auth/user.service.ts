import { Injectable } from '@nestjs/common'
import { customAlphabet as anuid } from 'nanoid/async'
import { customAlphabet as nsuid } from 'nanoid/non-secure'
import { PrismaService } from '@app/common'
import { Integration } from './types'

const anid = anuid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 18)
const rname = nsuid('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)

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
          nid: await anid(),
          integrations: { create: [some] },
          username: `User ${rname()}`,
        },
      })
    }
    return this.prisma.user.findFirstOrThrow({
      where: {
        integrations: { some },
      },
    })
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    })
  }
}
