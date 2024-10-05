import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TodoService } from '../todo.service';
import { Todo } from '../db/todo.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockTodo = {
    completed: false,
    priority: 'A',
    description: 'Test Todo',
    creationDate: new Date(),
    save: jest.fn().mockResolvedValue(this),
};

// Mock the constructor, returning mockTodo instance
const mockTodoModel = jest.fn(() => mockTodo);

// Mock the find method
Object.assign(mockTodoModel, {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    deleteMany: jest.fn(),
});

mockTodo.save = jest.fn().mockResolvedValue(mockTodo);

describe('TodoService', () => {
    let service: TodoService;
    let model: Model<Todo>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodoService,
                {
                    provide: getModelToken(Todo.name),
                    useValue: mockTodoModel,
                },
            ],
        }).compile();

        service = module.get<TodoService>(TodoService);
        model = module.get<Model<Todo>>(getModelToken(Todo.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new todo', async () => {
        const createTodoDto = {
            priority: 'A',
            description: 'Test Todo',
        };

        const result = await service.create(createTodoDto);

        expect(mockTodoModel).toHaveBeenCalledWith(createTodoDto);
        expect(mockTodo.save).toHaveBeenCalled();
        expect(result).toEqual(mockTodo);
    });

    it('should create a new todo despite null priority', async () => {
        const createTodoDto = {
            priority: null,
            description: 'Test Todo',
        };

        const result = await service.create(createTodoDto);

        expect(mockTodoModel).toHaveBeenCalledWith(createTodoDto);
        expect(mockTodo.save).toHaveBeenCalled();
        expect(result).toEqual(mockTodo);
    });

    it('should throw a BadRequestException if priority is invalid', async () => {
        const createTodoDto = {
            priority: 'invalid',
            description: 'Test Todo',
        };

        await expect(service.create(createTodoDto)).rejects.toThrow(
            'Invalid priority. Must be a single uppercase character.',
        );
    });

    it('should find all todos', async () => {
        const todos = [{}, {}] as Todo[];

        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValue(todos),
        } as any);

        const result = await service.findAll();

        expect(result).toEqual(todos);
    });

    it('should delete all todos', async () => {
        jest.spyOn(model, 'deleteMany').mockResolvedValue({
            acknowledged: true,
            deletedCount: 2,
        } as any);

        await service.deleteAll();

        expect(model.deleteMany).toHaveBeenCalledWith({});
    });

    it('should find a todo by id', async () => {
        const id = '123';

        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                ...mockTodo,
                id: id,
            }),
        } as any);

        const result = await service.findById(id);

        expect(result).toEqual({
            ...mockTodo,
            id,
        });
        expect(model.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if todo is not found', async () => {
        const id = 'nonExistentId';

        jest.spyOn(model, 'findById').mockImplementation(
            () =>
                ({
                    exec: jest.fn().mockResolvedValue(null),
                }) as any,
        );

        await expect(service.findById(id)).rejects.toThrow(NotFoundException);

        expect(model.findById).toHaveBeenCalledWith(id);
    });

    it('should delete a todo by id', async () => {
        const id = '123';

        jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

        await service.findByIdAndDelete(id);

        expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should return an empty array if no todos are found', async () => {
        const todos = [] as Todo[];

        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValue(todos),
        } as any);

        const result = await service.findAll();

        expect(result).toEqual([]);
    });

    it('should handle database errors when finding todos', async () => {
        // Mock find to simulate a database error
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error')),
        } as any);

        await expect(service.findAll()).rejects.toThrow('Database error');
    });

    it('should update an existing todo successfully', async () => {
        const id = '123';
        const updateTodoDto = {
            completed: true,
            priority: 'B',
            description: 'Updated description',
        };

        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockTodo),
        } as any);

        const updatedTodo = {
            ...mockTodo,
            ...updateTodoDto,
            completionDate: new Date(),
        };

        mockTodo.save = jest.fn().mockResolvedValue(updatedTodo);

        const result = await service.update(id, updateTodoDto);

        expect(model.findById).toHaveBeenCalledWith(id);
        expect(mockTodo.save).toHaveBeenCalled();
        expect(result.priority).toBe('B');
        expect(result.description).toBe('Updated description');
        expect(result.completionDate).toEqual(expect.any(Date));
    });

    it('should update the completion status', async () => {
        const id = '123';
        const updateTodoDto = {
            completed: false,
        };

        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockTodo),
        } as any);

        const updatedTodo = {
            ...mockTodo,
            ...updateTodoDto,
            completionDate: null,
        };

        mockTodo.save = jest.fn().mockResolvedValue(updatedTodo);

        const result = await service.update(id, updateTodoDto);

        expect(model.findById).toHaveBeenCalledWith(id);
        expect(mockTodo.save).toHaveBeenCalled();
        expect(result.completionDate).toEqual(null);
    });

    it('should throw a BadRequestException for invalid priority', async () => {
        const id = '123';
        const updateTodoDto1 = {
            priority: 'invalid',
        };
        const updateTodoDto2 = {
            priority: '1',
        };

        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockTodo),
        } as any);

        await expect(service.update(id, updateTodoDto1)).rejects.toThrow(
            'Invalid priority. Must be a single uppercase character.',
        );
        await expect(service.update(id, updateTodoDto2)).rejects.toThrow(
            'Invalid priority. Must be a single uppercase character.',
        );

        expect(model.findById).toHaveBeenCalledWith(id);
    });

    it('should return null if todo to update is not found', async () => {
        const id = 'nonExistentId';
        const updateTodoDto = {
            completed: true,
        };

        jest.spyOn(model, 'findById').mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

        const result = await service.update(id, updateTodoDto);

        expect(result).toBeNull();
        expect(model.findById).toHaveBeenCalledWith(id);
    });
});
