import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRsvpDto) {
    return this.rsvpService.create(dto);
  }

  // Painel admin — lista todas as confirmações.
  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.rsvpService.findAll();
  }

  // Painel admin — corrige um registro.
  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateRsvpDto) {
    return this.rsvpService.update(id, dto);
  }
}
