import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestesModule } from '../src/testes/testes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TestesService } from '../src/testes/testes.service';
import { ConfigModule } from '@nestjs/config';

const nonExistentValue = 'nonExistentValue';

describe('TestesController (e2e)', () => {
  let app: INestApplication;
  const mockService = {
    findAll: () => [
      { testValue: 'Teste 2', otherValue: 2, uniqueValue: 'Test1' },
    ],
    findOne: (value: string) => {
      if (value === nonExistentValue) {
        return null;
      }
      return { testValue: 'Teste 1', otherValue: 1, uniqueValue: value };
    },
    create: (dto: any) => ({ ...dto, id: '1' }),
    update: (value: string, dto: any) => ({ ...dto, uniqueValue: value }),
    remove: (value: string) => {
      if (value === nonExistentValue) {
        return null;
      }
      return { testValue: 'Teste 1', otherValue: 1, uniqueValue: value };
    },
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TestesModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
      ],
    })
      .overrideProvider(TestesService)
      .useValue(mockService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET testes', async () => {
    return request(app.getHttpServer())
      .get('/testes')
      .expect(200)
      .expect(mockService.findAll());
  });

  it('/POST testes', async () => {
    const createDto = {
      testValue: 'Teste Novo',
      otherValue: 3,
      uniqueValue: 'Test1',
    };
    return request(app.getHttpServer())
      .post('/testes')
      .send(createDto)
      .expect(201)
      .expect({ ...createDto, id: '1' });
  });

  it('/GET testes/:id', async () => {
    const id = '1';
    return request(app.getHttpServer())
      .get(`/testes/${id}`)
      .expect(200)
      .expect(mockService.findOne(id));
  });

  it('/PATCH testes/:id', async () => {
    const uniqueValue = '1';
    const updateDto = { testValue: 'Teste Atualizado', otherValue: 4 };
    return request(app.getHttpServer())
      .patch(`/testes/${uniqueValue}`)
      .send(updateDto)
      .expect(200)
      .expect({ ...updateDto, uniqueValue });
  });

  it('/DELETE testes/:value', async () => {
    const mockDeleteTeste = {
      testValue: 'Teste 1',
      otherValue: 1,
      uniqueValue: 'Test1',
    };
    return request(app.getHttpServer())
      .delete(`/testes/${mockDeleteTeste.uniqueValue}`)
      .expect(200)
      .expect(mockDeleteTeste);
  });

  it('should return 400 if creating a test object with invalid data', async () => {
    const invalidData = {
      uniqueValue: '',
      testValue: 1,
      otherValue: 'invalid',
    };

    const response = await request(app.getHttpServer())
      .post('/testes')
      .send(invalidData)
      .expect(400);

    expect(response.body.message).toContain('uniqueValue should not be empty');
    expect(response.body.message).toContain('testValue must be a string');
    expect(response.body.message).toContain('otherValue must be a number');
  });

  it('should return 404 if test object is not found', async () => {
    const response = await request(app.getHttpServer())
      .get(`/testes/${nonExistentValue}`)
      .expect(404);

    expect(response.body.message).toContain(
      `Test ${nonExistentValue} not found`,
    );
  });

  it('should return 400 if updating a test object with invalid data', async () => {
    const createDto = {
      testValue: 'Teste Novo',
      otherValue: 3,
      uniqueValue: 'Test1',
    };

    const createdResponse = await request(app.getHttpServer())
      .post('/testes')
      .send(createDto)
      .expect(201);

    const invalidUpdateData = {
      testValue: ' ',
      otherValue: 'invalid',
    };

    const response = await request(app.getHttpServer())
      .patch(`/testes/${createdResponse.body.uniqueValue}`)
      .send(invalidUpdateData)
      .expect(400);

    expect(response.body.message).toContain(
      'Field testValue should not be empty or contain only spaces',
    );
    expect(response.body.message).toContain(
      'otherValue must be a number conforming to the specified constraints',
    );
  });

  it('should return 404 if deleting a test object that does not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/testes/${nonExistentValue}`)
      .expect(404);

    expect(response.body.message).toEqual(`Test ${nonExistentValue} not found`);
  });
});
