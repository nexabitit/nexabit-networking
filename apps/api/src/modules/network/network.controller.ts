import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { NetworkService } from './network.service';

@ApiTags('network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('ip-lookup')
  @ApiQuery({ name: 'ip', required: true })
  async ipLookup(@Query('ip') ip: string) {
    if (!ip) throw new BadRequestException('ip parameter is required');
    return this.networkService.ipLookup(ip);
  }

  @Get('port-check')
  @ApiQuery({ name: 'host', required: true })
  @ApiQuery({ name: 'port', required: true })
  async portCheck(@Query('host') host: string, @Query('port') port: string) {
    if (!host || !port) throw new BadRequestException('host and port are required');
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      throw new BadRequestException('port must be between 1 and 65535');
    }
    return this.networkService.portCheck(host, portNum);
  }

  @Get('ping')
  @ApiQuery({ name: 'host', required: true })
  async ping(@Query('host') host: string) {
    if (!host) throw new BadRequestException('host parameter is required');
    return this.networkService.ping(host);
  }

  @Get('traceroute')
  @ApiQuery({ name: 'host', required: true })
  async traceroute(@Query('host') host: string) {
    if (!host) throw new BadRequestException('host parameter is required');
    return this.networkService.traceroute(host);
  }

  @Get('whois')
  @ApiQuery({ name: 'query', required: true })
  async whois(@Query('query') query: string) {
    if (!query) throw new BadRequestException('query parameter is required');
    return this.networkService.whois(query);
  }

  @Get('asn-lookup')
  @ApiQuery({ name: 'query', required: true })
  async asnLookup(@Query('query') query: string) {
    if (!query) throw new BadRequestException('query parameter is required');
    return this.networkService.asnLookup(query);
  }
}
