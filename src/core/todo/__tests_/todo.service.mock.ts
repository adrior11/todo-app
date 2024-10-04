import { Injectable } from '@nestjs/common';
import { Todo } from '../db/todo.schema';
import { v4 as uuidv4 } from 'uuid';

type MockTodo = Todo & { _id?: string };

@Injectable()
export class MockTodoService {
    public todos: MockTodo[] = [];

    async create(createTodoDto: any): Promise<MockTodo> {
        const newTodo = { _id: uuidv4(), ...createTodoDto };
        this.todos.push(newTodo);
        return newTodo;
    }

    async findAll(): Promise<MockTodo[]> {
        return this.todos;
    }

    async deleteAll(): Promise<void> {
        this.todos = [];
    }

    async findOneById(id: string): Promise<MockTodo | null> {
        return this.todos.find(todo => todo._id === id) || null;
    }

    async deleteOneById(id: string): Promise<void> {
        this.todos = this.todos.filter(todo => todo._id !== id);
    }

    async update(id: string, updateTodoDto: any): Promise<MockTodo | null> {
        const todo = await this.findOneById(id);
        if (!todo) {
            return null;
        }

        Object.assign(todo, updateTodoDto);
        return todo;
    }
}
