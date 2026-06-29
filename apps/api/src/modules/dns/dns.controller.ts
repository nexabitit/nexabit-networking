import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { DnsService } from './dns.service';

@ApiTags('dns')
@Controller('dns')
export class DnsController {
  constructor(private readonly dnsService: DnsService) {}

  @Get('lookup')
  @ApiQuery({ name: 'domain', required: true })
  @ApiQuery({ name: 'type', required: false, enum: ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA', 'PTR', 'SRV', 'CNAME'] })
  async lookup(@Query('domain') domain: string, @Query('type') type = 'A') {
    if (!domain) throw new BadRequestException('domain parameter is required');
    return this.dnsService.lookup(domain, type as 'A');
  }

  @Get('spf')
  @ApiQuery({ name: 'domain', required: true })
  async spf(@Query('domain') domain: string) {
    if (!domain) throw new BadRequestException('domain parameter is required');
    return this.dnsService.spf(domain);
  }

  @Get('dkim')
  @ApiQuery({ name: 'domain', required: true })
  @ApiQuery({ name: 'selector', required: false })
  async dkim(@Query('domain') domain: string, @Query('selector') selector?: string) {
    if (!domain) throw new BadRequestException('domain parameter is required');
    return this.dnsService.dkim(domain, selector);
  }

  @Get('dmarc')
  @ApiQuery({ name: 'domain', required: true })
  async dmarc(@Query('domain') domain: string) {
    if (!domain) throw new BadRequestException('domain parameter is required');
    return this.dnsService.dmarc(domain);
  }

  @Get('propagation')
  @ApiQuery({ name: 'domain', required: true })
  @ApiQuery({ name: 'type', required: false })
  async propagation(@Query('domain') domain: string, @Query('type') type = 'A') {
    if (!domain) throw new BadRequestException('domain parameter is required');
    return this.dnsService.propagation(domain, type as 'A');
  }
}
