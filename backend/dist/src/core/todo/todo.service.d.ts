import { Model } from 'mongoose';
import { Todo, TodoDocument } from './db/todo.schema';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';
export declare class TodoService {
    private readonly todoModel;
    constructor(todoModel: Model<TodoDocument>);
    create(createTodoDto: CreateTodoDto): Promise<Todo>;
    findAll(): Promise<Todo[]>;
    deleteAll(): Promise<void>;
    findById(id: string): Promise<TodoDocument | null>;
    findByIdAndDelete(id: string): Promise<void>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<TodoDocument | null>;
}
