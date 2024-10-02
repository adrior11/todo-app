import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './db/todo.schema';
import { Counter, CounterDocument } from './db/counter.schema';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
        @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    ) {}

    async getNextSequenceValue(sequenceName: string): Promise<number> {
        const counter = await this.counterModel.findOneAndUpdate(
            { _id: sequenceName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }, // Create new model if it doesn't exist
        );
        return counter.seq;
    }

    async create(todo: Todo): Promise<Todo> {
        const newTodo = new this.todoModel({
            ...todo,
            // Assign next sequential ID
            id: await this.getNextSequenceValue('todoId'),
        });
        return newTodo.save();
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }

    async findOneById(id: number): Promise<Todo | null> {
        return this.todoModel.findOne({ id }).exec();
    }
}

