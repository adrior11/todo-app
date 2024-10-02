import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './db/todo.schema';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {}

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const newTodo = new this.todoModel(createTodoDto);
        return newTodo.save();
        // const { completed = false } = createTodoDto;
        // const completionDate = completed ? new Date() : null;
        // const options = { ...createTodoDto, completed, completionDate };
        // console.log(options);
        // const newTodo = new this.todoModel({
        //     ...createTodoDto,
        //     completed,
        //     completionDate,
        // });
        // return newTodo.save();
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }

    async deleteAll(): Promise<void> {
        await this.todoModel.deleteMany({});
    }

    // TODO: DeadRequestExc.
    async findOneById(id: string): Promise<TodoDocument | null> {
        return this.todoModel.findById(id).exec();
    }

    async deleteOneById(id: string): Promise<void> {
        await this.todoModel.findByIdAndDelete(id).exec();
    }

    // BUG: completion isn't getting setp
    async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument | null> {
        return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true }).exec();
    }
}
