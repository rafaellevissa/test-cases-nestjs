import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNotBlank } from '../../decorators/is-not-blank-decorator';
export class CreateTestesDto {
  @IsNotEmpty({ message: 'uniqueValue should not be empty' })
  @IsString()
  readonly uniqueValue: string;

  @IsNotEmpty()
  @IsString({ message: 'testValue must be a string' })
  @IsNotBlank()
  readonly testValue: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'otherValue must be a number' })
  @IsNotBlank()
  readonly otherValue: number;
}
