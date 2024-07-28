// src/comments/comments.controller.ts
import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post(':postId/comments')
    async addComment(@Param('postId') postId: number, @Body() createCommentDto: CreateCommentDto, @Request() req) {
        return this.commentsService.addComment(postId, createCommentDto, req.user.id);
    }

    @Get(':postId/comments')
    async getComments(@Param('postId') postId: number) {
        return this.commentsService.getComments(postId);
    }
}