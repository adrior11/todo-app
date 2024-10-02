import { IsBoolean, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
    @IsOptional()
    @IsBoolean()
    completed?: boolean;

    @IsOptional()
    @Length(1, 1)
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    priority?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;
}

