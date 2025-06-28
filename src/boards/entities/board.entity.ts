import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { dbTimeStamp } from 'src/utils';

@Schema({ timestamps: dbTimeStamp })
export class Board extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: Types.ObjectId;

  @Prop({ default: [] })
  members: string[];

  @Prop({ default: true })
  active: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
