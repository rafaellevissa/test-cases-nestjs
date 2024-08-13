import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testes } from './schemas/testes.schema';
import { CreateTestesDto } from './dto/create-testes.dto';
import { UpdateTestesDto } from './dto/update-testes.dto';

@Injectable()
export class TestesService {
  constructor(
    @InjectModel(Testes.name) private readonly testeModel: Model<Testes>,
  ) {}

  async create(createTestesDto: CreateTestesDto): Promise<Testes> {
    const createTeste = await this.testeModel.create(createTestesDto);
    return createTeste;
  }

  async findAll(): Promise<Testes[]> {
    return this.testeModel.find().exec();
  }

  async findOne(uniqueValue: string): Promise<Testes> {
    const teste = await this.testeModel.findOne({ uniqueValue }).exec();
    if (!teste) {
      throw new NotFoundException(`Test ${uniqueValue} not found`);
    }
    return teste;
  }

  async update(
    uniqueValue: string,
    updateTestesDto: UpdateTestesDto,
  ): Promise<Testes> {
    const updatedTeste = await this.testeModel
      .findOneAndUpdate({ uniqueValue }, updateTestesDto, { new: true })
      .exec();
    if (!updatedTeste) {
      throw new NotFoundException(`Test ${uniqueValue} not found`);
    }
    return updatedTeste;
  }

  async remove(uniqueValue: string): Promise<Testes> {
    const result = await this.testeModel
      .findOneAndDelete({ uniqueValue })
      .exec();
    if (!result) {
      throw new NotFoundException(`Test ${uniqueValue} not found`);
    }
    return result;
  }
}
