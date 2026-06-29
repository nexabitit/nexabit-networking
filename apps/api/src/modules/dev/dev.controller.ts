import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { DevService } from './dev.service';

class WebhookTestDto {
  url!: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

@ApiTags('dev')
@Controller('dev')
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Post('webhook-test')
  @ApiBody({ type: WebhookTestDto })
  async webhookTest(@Body() dto: WebhookTestDto) {
    if (!dto.url) throw new BadRequestException('url is required');
    return this.devService.webhookTest(
      dto.url,
      dto.method || 'POST',
      dto.headers || {},
      dto.body,
    );
  }
}
