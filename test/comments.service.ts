// test/comments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from '../src/comments/comments.service';
import { Comment } from '../src/entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CommentsService', () => {
    let service: CommentsService;
    let repository: Repository<Comment>;

    const mockCommentRepository = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: getRepositoryToken(Comment),
                    useValue: mockCommentRepository,
                },
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('addComment', () => {
        it('should create and return a comment', async () => {
            const comment = new Comment();
            jest.spyOn(repository, 'create').mockReturnValue(comment);
            jest.spyOn(repository, 'save').mockResolvedValue(comment);
            expect(await service.addComment(1, { content: 'Test Comment' }, 1)).toBe(comment);
        });
    });

    describe('getComments', () => {
        it('should return an array of comments', async () => {
            const result = [new Comment(), new Comment()];
            jest.spyOn(repository, 'find').mockResolvedValue(result);
            expect(await service.getComments(1)).toBe(result);
        });
    });
});
