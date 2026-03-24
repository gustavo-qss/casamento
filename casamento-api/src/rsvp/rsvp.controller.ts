import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRsvpDto) {
    return this.rsvpService.create(dto);
  }
}
