import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestesService } from './testes.service';
import { CreateTestesDto } from './dto/create-testes.dto';
import { UpdateTestesDto } from './dto/update-testes.dto';

@Controller('testes')
export class TestesController {
  constructor(private readonly testesService: TestesService) {}

  @Post()
  create(@Body() createTestisDto: CreateTestesDto) {
    return this.testesService.create(createTestisDto);
  }

  @Get()
  findAll() {
    return this.testesService.findAll();
  }

  @Get(':uniqueValue')
  findOne(@Param('uniqueValue') uniqueValue: string) {
    return this.testesService.findOne(uniqueValue);
  }

  @Patch(':uniqueValue')
  update(
    @Param('uniqueValue') uniqueValue: string,
    @Body() updateTestisDto: UpdateTestesDto,
  ) {
    return this.testesService.update(uniqueValue, updateTestisDto);
  }

  @Delete(':uniqueValue')
  remove(@Param('uniqueValue') uniqueValue: string) {
    return this.testesService.remove(uniqueValue);
  }
}
