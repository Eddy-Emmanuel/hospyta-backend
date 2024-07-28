// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) {}

    async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
        const post = this.postsRepository.create({ ...createPostDto, user: { id: userId } });
        return this.postsRepository.save(post);
    }

    async findAll(): Promise<Post[]> {
        return this.postsRepository.find({ relations: ['user', 'comments'] });
    }

    async update(id: number, updatePostDto: CreatePostDto, userId: number): Promise<Post> {
        const post = await this.postsRepository.findOne(id);
        if (post.user.id !== userId) {
            throw new Error('Unauthorized');
        }
        Object.assign(post, updatePostDto);
        return this.postsRepository.save(post);
    }

    async remove(id: number, userId: number): Promise<void> {
        const post = await this.postsRepository.findOne(id);
        if (post.user.id !== userId) {
            throw new Error('Unauthorized');
        }
        await this.postsRepository.delete(id);
    }

    async upvote(id: number): Promise<Post> {
        const post = await this.postsRepository.findOne(id);
        post.upvotes += 1; // Assuming you have an upvotes field
        return this.postsRepository.save(post);
    }

    async downvote(id: number): Promise<Post> {
        const post = await this.postsRepository.findOne(id);
        post.downvotes += 1; // Assuming you have a downvotes field
        return this.postsRepository.save(post);
    }
}
