"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const todo_controller_1 = require("../todo.controller");
const todo_service_1 = require("../todo.service");
const common_1 = require("@nestjs/common");
const create_todo_dto_1 = require("../db/dtos/create-todo.dto");
const mockTodo = {
    _id: 'someId',
    completed: false,
    priority: 'A',
    description: 'Test Todo',
    creationDate: new Date(),
    save: jest.fn(),
};
const mockTodoService = {
    create: jest.fn().mockResolvedValue(mockTodo),
    findAll: jest.fn().mockResolvedValue([mockTodo]),
    findById: jest.fn().mockResolvedValue(mockTodo),
    findByIdAndDelete: jest.fn().mockResolvedValue(true),
    deleteAll: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(mockTodo),
};
describe('TodoController', () => {
    let controller;
    let service;
    let validationPipe;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [todo_controller_1.TodoController],
            providers: [
                {
                    provide: todo_service_1.TodoService,
                    useValue: mockTodoService,
                },
            ],
        }).compile();
        controller = module.get(todo_controller_1.TodoController);
        service = module.get(todo_service_1.TodoService);
        validationPipe = new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        });
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a new todo', async () => {
            const createTodoDto = {
                priority: 'A',
                description: 'Test Todo',
            };
            const validateDto = await validationPipe.transform(createTodoDto, {
                type: 'body',
                metatype: create_todo_dto_1.CreateTodoDto,
            });
            const result = await controller.create(validateDto);
            expect(service.create).toHaveBeenCalledWith(createTodoDto);
            expect(result).toEqual(mockTodo);
        });
        it('should throw a validation error if priority is not uppercase', async () => {
            const createTodoDto = {
                priority: 'a',
                description: 'Test Todo',
            };
            await expect(validationPipe.transform(createTodoDto, { type: 'body', metatype: create_todo_dto_1.CreateTodoDto })).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('findAll', () => {
        it('should return an array of todos', async () => {
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockTodo]);
        });
    });
    describe('findOneById', () => {
        it('should return a todo by ID', async () => {
            const id = '123';
            jest.spyOn(service, 'findById').mockResolvedValue(mockTodo);
            const result = await controller.findOneById(id);
            expect(service.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockTodo);
        });
        it('should throw NotFoundException if todo not found', async () => {
            const id = 'nonExistentId';
            service.findById = jest.fn().mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.findOneById(id)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('deleteAll', () => {
        it('should delete all todos', async () => {
            const result = await controller.deleteAll();
            expect(service.deleteAll).toHaveBeenCalled();
            expect(result).toEqual({ message: 'All TODOs cleared' });
        });
    });
    describe('deleteOneById', () => {
        it('should delete a todo by ID', async () => {
            const id = '123';
            const result = await controller.deleteOneById(id);
            expect(service.findByIdAndDelete).toHaveBeenCalledWith(id);
            expect(result).toEqual(true);
        });
    });
    describe('update', () => {
        it('should update a todo', async () => {
            const id = '123';
            const updateTodoDto = {
                priority: 'B',
                description: 'Updated description',
            };
            const result = await controller.update(id, updateTodoDto);
            expect(service.update).toHaveBeenCalledWith(id, updateTodoDto);
            expect(result).toEqual(mockTodo);
        });
        it('should throw NotFoundException if todo not found', async () => {
            const id = 'nonExistentId';
            service.update = jest.fn().mockResolvedValue(null);
            await expect(controller.update(id, {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
//# sourceMappingURL=todo.controller.spec.js.map