import { IsOptional, IsString } from 'class-validator'

export class DiscordLoginDto {
  @IsString()
  @IsOptional()
  code?: string
  @IsString()
  @IsOptional()
  state?: string
  @IsString()
  @IsOptional()
  error?: string
}
