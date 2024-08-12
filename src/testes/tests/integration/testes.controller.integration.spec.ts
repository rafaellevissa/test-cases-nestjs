import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestesModule } from '../../testes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Testes, TestesSchema } from '../../schemas/testes.schema';
import { ConfigModule } from '@nestjs/config';

describe('TestesController (integration)', () => {
  let app: INestApplication;
  let model: Model<Testes>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TestesModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        MongooseModule.forFeature([
          { name: Testes.name, schema: TestesSchema },
        ]),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    model = moduleRef.get<Model<Testes>>(getModelToken(Testes.name));
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await model.deleteMany({});
  });

  it('/GET testes', async () => {
    const test1 = new model({
      testValue: 'Teste 1',
      otherValue: 1,
      uniqueValue: 'Test1',
    });
    await test1.save();
    const test2 = new model({
      testValue: 'Teste 2',
      otherValue: 2,
      uniqueValue: 'Test2',
    });
    await test2.save();

    return request(app.getHttpServer())
      .get('/testes')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              testValue: 'Teste 1',
              otherValue: 1,
              uniqueValue: 'Test1',
            }),
            expect.objectContaining({
              testValue: 'Teste 2',
              otherValue: 2,
              uniqueValue: 'Test2',
            }),
          ]),
        );
      });
  });

  it('/POST testes', async () => {
    const createDto = {
      testValue: 'Teste Novo',
      otherValue: 3,
      uniqueValue: 'Test3',
    };
    return request(app.getHttpServer())
      .post('/testes')
      .send(createDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject(createDto);
        expect(res.body).toHaveProperty('_id');
      });
  });

  it('/GET testes/:uniqueValue', async () => {
    const test = new model({
      testValue: 'Teste 1',
      otherValue: 1,
      uniqueValue: 'Test1',
    });
    const savedTest = await test.save();

    return request(app.getHttpServer())
      .get(`/testes/${savedTest.uniqueValue}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            _id: savedTest._id.toString(),
            testValue: 'Teste 1',
            otherValue: 1,
            uniqueValue: 'Test1',
          }),
        );
      });
  });

  it('/PATCH testes/:uniqueValue', async () => {
    const test = new model({
      testValue: 'Teste 1',
      otherValue: 1,
      uniqueValue: 'Test1',
    });
    const savedTest = await test.save();
    const updateDto = { testValue: 'Teste Atualizado', otherValue: 4 };

    return request(app.getHttpServer())
      .patch(`/testes/${savedTest.uniqueValue}`)
      .send(updateDto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            _id: savedTest._id.toString(),
            testValue: 'Teste Atualizado',
            otherValue: 4,
            uniqueValue: 'Test1',
          }),
        );
      });
  });

  it('/DELETE testes/:uniqueValue', async () => {
    const test = new model({
      testValue: 'Teste 1',
      otherValue: 1,
      uniqueValue: 'Test1',
    });
    const savedTest = await test.save();

    return request(app.getHttpServer())
      .delete(`/testes/${savedTest.uniqueValue}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            _id: savedTest._id.toString(),
            testValue: 'Teste 1',
            otherValue: 1,
            uniqueValue: 'Test1',
          }),
        );
      });
  });
});
