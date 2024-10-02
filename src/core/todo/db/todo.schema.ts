import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
    @Prop({ required: true, type: Boolean, default: false })
    completed!: boolean;

    @Prop({ type: String, maxlength: 1, uppercase: true })
    priority?: string;

    @Prop({ type: Date })
    completionDate?: Date;

    @Prop({ required: true, type: Date, default: Date.now })
    creationDate!: Date;

    // NOTE: Shouldn't be optional
    @Prop({ type: String })
    description?: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
