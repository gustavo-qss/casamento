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
import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('letters')
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateLetterDto) {
    return this.lettersService.create(dto);
  }

  // Painel admin — lista todas as mensagens.
  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.lettersService.findAll();
  }

  // Painel admin — corrige uma mensagem.
  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateLetterDto) {
    return this.lettersService.update(id, dto);
  }
}
