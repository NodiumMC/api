import { IsNumber, IsString } from 'class-validator'

export class DiscordGrantDto {
  @IsString()
  access_token: string
  @IsString()
  token_type: string
  @IsNumber()
  expires_in: number
  @IsString()
  refresh_token: string
  @IsString()
  scope: string
}
