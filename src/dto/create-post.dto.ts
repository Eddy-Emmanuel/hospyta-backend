// src/posts/dto/create-post.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    category: string;
}
