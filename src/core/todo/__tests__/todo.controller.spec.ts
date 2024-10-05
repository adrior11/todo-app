import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../todo.controller';
import { TodoService } from '../todo.service';
import { BadRequestException, NotFoundException, ValidationPipe } from '@nestjs/common';
import { CreateTodoDto } from '../db/dtos/create-todo.dto';
import { UpdateTodoDto } from '../db/dtos/update-todo.dto';
import { TodoDocument } from '../db/todo.schema';

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
    let controller: TodoController;
    let service: TodoService;
    let validationPipe: ValidationPipe;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodoController],
            providers: [
                {
                    provide: TodoService,
                    useValue: mockTodoService,
                },
            ],
        }).compile();

        controller = module.get<TodoController>(TodoController);
        service = module.get<TodoService>(TodoService);

        validationPipe = new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        });
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new todo', async () => {
            const createTodoDto: CreateTodoDto = {
                priority: 'A',
                description: 'Test Todo',
            };

            const validateDto = await validationPipe.transform(createTodoDto, {
                type: 'body',
                metatype: CreateTodoDto,
            });

            const result = await controller.create(validateDto);

            expect(service.create).toHaveBeenCalledWith(createTodoDto);
            expect(result).toEqual(mockTodo);
        });

        it('should throw a validation error if priority is not uppercase', async () => {
            const createTodoDto: CreateTodoDto = {
                priority: 'a',
                description: 'Test Todo',
            };

            await expect(
                validationPipe.transform(createTodoDto, { type: 'body', metatype: CreateTodoDto }),
            ).rejects.toThrow(BadRequestException);
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

            jest.spyOn(service, 'findById').mockResolvedValue(mockTodo as unknown as TodoDocument);

            const result = await controller.findOneById(id);

            expect(service.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(mockTodo);
        });

        it('should throw NotFoundException if todo not found', async () => {
            const id = 'nonExistentId';
            service.findById = jest.fn().mockRejectedValue(new NotFoundException());

            await expect(controller.findOneById(id)).rejects.toThrow(NotFoundException);
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
            const updateTodoDto: UpdateTodoDto = {
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

            await expect(controller.update(id, {})).rejects.toThrow(NotFoundException);
        });
    });
});
