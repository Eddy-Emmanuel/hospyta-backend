// test/posts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../src/posts/posts.service';
import { Post } from '../src/entities/post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('PostsService', () => {
    let service: PostsService;
    let repository: Repository<Post>;

    const mockPostRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: mockPostRepository,
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);
        repository = module.get<Repository<Post>>(getRepositoryToken(Post));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            const result = [new Post(), new Post()];
            jest.spyOn(repository, 'find').mockResolvedValue(result);
            expect(await service.findAll()).toBe(result);
        });
    });

    describe('create', () => {
        it('should create and return a post', async () => {
            const post = new Post();
            jest.spyOn(repository, 'create').mockReturnValue(post);
            jest.spyOn(repository, 'save').mockResolvedValue(post);
            expect(await service.create({ content: 'Test Post', category: 'General' }, 1)).toBe(post);
        });
    });

    describe('remove', () => {
        it('should delete a post', async () => {
            const postId = 1;
            jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
            await service.remove(postId, 1);
            expect(repository.delete).toHaveBeenCalledWith(postId);
        });
    });
});
