import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    completed?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(1)
    @IsNotEmpty()
    description?: string;
}
