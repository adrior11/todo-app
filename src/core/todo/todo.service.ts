import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './db/todo.schema';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {}

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        if (createTodoDto.priority !== undefined) {
            if (createTodoDto.priority.length !== 1 || !/[A-Z]/.test(createTodoDto.priority)) {
                throw new BadRequestException('Invalid priority. Must be a single uppercase character.');
            }
        }

        const completionDate = createTodoDto.completed ? new Date() : null;
        const newTodo = new this.todoModel({
            ...createTodoDto,
            completionDate,
        });

        return newTodo.save();
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }

    async deleteAll(): Promise<void> {
        await this.todoModel.deleteMany({});
    }

    async findById(id: string): Promise<TodoDocument | null> {
        const todo = await this.todoModel.findById(id).exec();
        if (!todo) {
            throw new NotFoundException('Todo with id ${id} not found');
        }
        return todo;
    }

    async findByIdAndDelete(id: string): Promise<void> {
        await this.todoModel.findByIdAndDelete(id);
    }

    async update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument | null> {
        const todo = await this.todoModel.findById(id).exec();

        if (!todo) {
            return null;
        }

        if (updateTodoDto.completed !== undefined) {
            todo.completed = updateTodoDto.completed;
            todo.completionDate = updateTodoDto.completed ? new Date() : null;
        }

        if (updateTodoDto.priority !== undefined) {
            if (updateTodoDto.priority.length !== 1 || !/[A-Z]/.test(updateTodoDto.priority)) {
                throw new BadRequestException('Invalid priority. Must be a single uppercase character.');
            }
            todo.priority = updateTodoDto.priority;
        }

        if (updateTodoDto.description !== undefined) {
            todo.description = updateTodoDto.description;
        }

        return todo.save();
    }
}
