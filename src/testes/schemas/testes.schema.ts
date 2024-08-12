import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestesDocument = HydratedDocument<Testes>;

@Schema()
export class Testes {
  @Prop({ unique: true, required: true })
  uniqueValue: string;

  @Prop()
  testValue: string;

  @Prop()
  otherValue: number;
}

export const TestesSchema = SchemaFactory.createForClass(Testes);
