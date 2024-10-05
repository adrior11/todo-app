import { TodoService } from './todo.service';
import { CreateTodoDto } from './db/dtos/create-todo.dto';
import { UpdateTodoDto } from './db/dtos/update-todo.dto';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    create(createTodoDto: CreateTodoDto): Promise<import('./db/todo.schema').Todo>;
    findAll(): Promise<import('./db/todo.schema').Todo[]>;
    deleteAll(): Promise<{
        message: string;
    }>;
    findOneById(id: string): Promise<import('./db/todo.schema').TodoDocument>;
    deleteOneById(id: string): Promise<void>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import('./db/todo.schema').TodoDocument>;
}
