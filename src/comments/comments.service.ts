// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
    ) {}

    async addComment(postId: number, createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
        const comment = this.commentsRepository.create({ ...createCommentDto, post: { id: postId }, user: { id: userId } });
        return this.commentsRepository.save(comment);
    }

    async getComments(postId: number): Promise<Comment[]> {
        return this.commentsRepository.find({ where: { post: { id: postId } }, relations: ['user'] });
    }
}