import { IntegrationType } from '@prisma/client'

export class Integration {
  type: IntegrationType
  iid: string
}

export class TokenPair {
  accessToken: string
  refreshToken: string
}
