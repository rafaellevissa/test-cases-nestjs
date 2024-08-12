import { Module } from '@nestjs/common';
import { TestesService } from './testes.service';
import { TestesController } from './testes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Testes, TestesSchema } from './schemas/testes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Testes.name, schema: TestesSchema }]),
  ],
  controllers: [TestesController],
  providers: [TestesService],
})
export class TestesModule {}
