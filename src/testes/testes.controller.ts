import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { TestesService } from './testes.service';
import { CreateTestesDto } from './dto/create-testes.dto';
import { UpdateTestesDto } from './dto/update-testes.dto';

@Controller('testes')
export class TestesController {
  constructor(private readonly testesService: TestesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createTestisDto: CreateTestesDto) {
    return this.testesService.create(createTestisDto);
  }

  @Get()
  findAll() {
    return this.testesService.findAll();
  }

  @Get(':uniqueValue')
  findOne(@Param('uniqueValue') uniqueValue: string) {
    const teste = this.testesService.findOne(uniqueValue);
    if (!teste) {
      throw new NotFoundException(`Test ${uniqueValue} not found`);
    }
    return teste;
  }

  @Patch(':uniqueValue')
  update(
    @Param('uniqueValue') uniqueValue: string,
    @Body() updateTestesDto: UpdateTestesDto,
  ) {
    return this.testesService.update(uniqueValue, updateTestesDto);
  }

  @Delete(':uniqueValue')
  remove(@Param('uniqueValue') uniqueValue: string) {
    const deletedTeste = this.testesService.remove(uniqueValue);
    if (!deletedTeste) {
      throw new NotFoundException(`Test ${uniqueValue} not found`);
    }
    return deletedTeste;
  }
}
