// src/posts/posts.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
        return this.postsService.create(createPostDto, req.user.id);
    }

    @Get()
    async findAll() {
        return this.postsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updatePostDto: CreatePostDto, @Request() req) {
        return this.postsService.update(id, updatePostDto, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        return this.postsService.remove(id, req.user.id);
    }

    @Patch(':id/upvote')
    async upvote(@Param('id') id: number) {
        return this.postsService.upvote(id);
    }

    @Patch(':id/downvote')
    async downvote(@Param('id') id: number) {
        return this.postsService.downvote(id);
    }
}
