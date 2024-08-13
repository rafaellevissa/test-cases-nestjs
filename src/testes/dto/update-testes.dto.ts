import { PartialType } from '@nestjs/mapped-types';
import { CreateTestesDto } from './create-testes.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from '../../decorators/is-not-blank-decorator';

export class UpdateTestesDto extends PartialType(CreateTestesDto) {
  @IsString()
  @IsNotBlank()
  @IsOptional()
  testValue?: string;

  @IsNumber()
  @IsOptional()
  otherValue?: number;
}
