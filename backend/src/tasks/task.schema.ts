import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { List } from '../lists/list.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  dueDate: string;

  @Prop({ required: true })
  priority: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'List' })
  list: List;

  @Prop({ default: Date.now() })
  createdDate: number;

  @Prop({ default: 1 })
  order: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
