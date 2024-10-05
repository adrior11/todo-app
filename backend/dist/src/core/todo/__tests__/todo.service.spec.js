'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const testing_1 = require('@nestjs/testing');
const mongoose_1 = require('@nestjs/mongoose');
const todo_service_1 = require('../todo.service');
const todo_schema_1 = require('../db/todo.schema');
const common_1 = require('@nestjs/common');
const mockTodo = {
    completed: false,
    priority: 'A',
    description: 'Test Todo',
    creationDate: new Date(),
    save: jest.fn().mockResolvedValue(this),
};
const mockTodoModel = jest.fn(() => mockTodo);
Object.assign(mockTodoModel, {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    deleteMany: jest.fn(),
});
mockTodo.save = jest.fn().mockResolvedValue(mockTodo);
describe('TodoService', () => {
    let service;
    let model;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                todo_service_1.TodoService,
                {
                    provide: (0, mongoose_1.getModelToken)(todo_schema_1.Todo.name),
                    useValue: mockTodoModel,
                },
            ],
        }).compile();
        service = module.get(todo_service_1.TodoService);
        model = module.get((0, mongoose_1.getModelToken)(todo_schema_1.Todo.name));
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
        const todos = [{}, {}];
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValue(todos),
        });
        const result = await service.findAll();
        expect(result).toEqual(todos);
    });
    it('should delete all todos', async () => {
        jest.spyOn(model, 'deleteMany').mockResolvedValue({
            acknowledged: true,
            deletedCount: 2,
        });
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
        });
        const result = await service.findById(id);
        expect(result).toEqual({
            ...mockTodo,
            id,
        });
        expect(model.findById).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException if todo is not found', async () => {
        const id = 'nonExistentId';
        jest.spyOn(model, 'findById').mockImplementation(() => ({
            exec: jest.fn().mockResolvedValue(null),
        }));
        await expect(service.findById(id)).rejects.toThrow(common_1.NotFoundException);
        expect(model.findById).toHaveBeenCalledWith(id);
    });
    it('should delete a todo by id', async () => {
        const id = '123';
        jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);
        await service.findByIdAndDelete(id);
        expect(model.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
    it('should return an empty array if no todos are found', async () => {
        const todos = [];
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockResolvedValue(todos),
        });
        const result = await service.findAll();
        expect(result).toEqual([]);
    });
    it('should handle database errors when finding todos', async () => {
        jest.spyOn(model, 'find').mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('Database error')),
        });
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
        });
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
        });
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
        });
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
        });
        const result = await service.update(id, updateTodoDto);
        expect(result).toBeNull();
        expect(model.findById).toHaveBeenCalledWith(id);
    });
});
//# sourceMappingURL=todo.service.spec.js.map
