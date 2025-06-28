import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Board } from '../../boards/entities/board.entity';
import { dbTimeStamp } from 'src/utils';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}
@Schema({ timestamps: dbTimeStamp })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: Object.values(TaskStatus), default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: Board.name, required: true })
  board: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// TaskSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });
