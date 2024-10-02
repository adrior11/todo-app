import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './db/todo.schema';
import { Counter, CounterDocument } from './db/counter.schema';
import { CreateTodoDto } from './db/dtos/create-todo.dto';

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

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const { completed = false } = createTodoDto;
        const completionDate = completed ? new Date() : null;
        const newTodo = new this.todoModel({
            ...createTodoDto,
            completed,
            completionDate,
            id: await this.getNextSequenceValue('todoId'), // Generate seq. ID
        });
        return newTodo.save();
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }

    async findOneById(id: number): Promise<TodoDocument | null> {
        return this.todoModel.findOne({ id }).exec();
    }

    // TODO: Prevent call if already true?
    async complete(id: number): Promise<TodoDocument | null> {
        const todo = await this.findOneById(id);
        if (!todo) {
            return null;
        }
        todo.completed = true;
        todo.completionDate = new Date();
        return todo.save();
    }
}

