import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { SslService } from './ssl.service';

@ApiTags('ssl')
@Controller('ssl')
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Get('check')
  @ApiQuery({ name: 'hostname', required: true })
  @ApiQuery({ name: 'port', required: false })
  async check(@Query('hostname') hostname: string, @Query('port') port?: string) {
    if (!hostname) throw new BadRequestException('hostname parameter is required');
    return this.sslService.check(hostname, port ? parseInt(port, 10) : 443);
  }

  @Get('expiry')
  @ApiQuery({ name: 'hostname', required: true })
  async expiry(@Query('hostname') hostname: string) {
    if (!hostname) throw new BadRequestException('hostname parameter is required');
    return this.sslService.expiry(hostname);
  }
}
