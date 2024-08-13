import { Test, TestingModule } from '@nestjs/testing';
import { TestesService } from '../testes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testes } from '../schemas/testes.schema';
import { NotFoundException } from '@nestjs/common';

const mock = {
  uniqueValue: 'Test1',
  testValue: 'Teste jest 1',
  otherValue: 123,
};

describe('TestesService', () => {
  let service: TestesService;
  let model: Model<Testes>;
  const mockTestes = [
    {
      _id: '1',
      uniqueValue: 'Test1',
      testValue: 'Teste jest 1',
      otherValue: 123,
    },
    {
      _id: '2',
      uniqueValue: 'Test2',
      testValue: 'Teste jest 2',
      otherValue: 234,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestesService,
        {
          provide: getModelToken(Testes.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mock),
            constructor: jest.fn().mockResolvedValue(mock),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TestesService>(TestesService);
    model = module.get<Model<Testes>>(getModelToken(Testes.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new test object', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        uniqueValue: 'Test1',
        testValue: 'Teste jest 1',
        otherValue: 123,
      } as any),
    );
    const newTeste = await service.create({
      uniqueValue: 'Test1',
      testValue: 'Teste jest 1',
      otherValue: 123,
    });
    expect(newTeste).toEqual(mock);
  });

  it('should return all tests objects', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTestes),
    } as any);
    const testes = await service.findAll();
    expect(testes).toEqual(mockTestes);
  });

  it('should return one test object by uniqueValue', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockTestes[0]),
    } as any);

    const result = await service.findOne('1');
    expect(result).toEqual(mockTestes[0]);
  });

  it('should throw an error when a test object is not found', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);

    await expect(service.findOne('3')).rejects.toThrow(NotFoundException);
  });

  it('should update an existing test object', async () => {
    const updateTest = { testValue: 'Teste Updated', otherValue: 1 };
    const updatedTest = { _id: '1', ...updateTest };

    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(updatedTest),
    } as any);

    const result = await service.update('1', updateTest);
    expect(result).toEqual(updatedTest);
  });

  it('should delete a test object by ID', async () => {
    const mockDeleteResult = {
      _id: '1',
      uniqueValue: 'Test1',
      testValue: 'Teste jest 1',
      otherValue: 123,
    };
    jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
      exec: jest.fn().mockReturnValueOnce(mockDeleteResult),
    } as any);

    const result = await service.remove('1');
    expect(result).toEqual(mockDeleteResult);
  });

  it('should throw an error if creation fails', async () => {
    const errorMessage = 'Error creating test object';
    jest.spyOn(model, 'create').mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    await expect(service.create(mock)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if findOne fails', async () => {
    const errorMessage = 'Error finding test object';
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    } as any);

    await expect(service.findOne('1')).rejects.toThrow(errorMessage);
  });

  it('should throw an error if update fails', async () => {
    const errorMessage = 'Error updating test object';
    const updateTest = { testValue: 'Teste Updated', otherValue: 1 };

    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    } as any);

    await expect(service.update('1', updateTest)).rejects.toThrow(errorMessage);
  });

  it('should throw an error if delete fails', async () => {
    const errorMessage = 'Error deleting test object';

    jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    } as any);

    await expect(service.remove('1')).rejects.toThrow(errorMessage);
  });
});
