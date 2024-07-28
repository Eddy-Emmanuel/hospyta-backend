// test/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUsersService = {
        findByUsername: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return a JWT token', async () => {
            const user: User = { id: 1, username: 'test', password: 'hashedPassword' };
            jest.spyOn(usersService, 'findByUsername').mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(jwtService, 'sign').mockReturnValue('token');

            const result = await service.login({ username: 'test', password: 'password' });
            expect(result).toEqual({ access_token: 'token' });
        });

        it('should throw an error if user not found', async () => {
            jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);
            await expect(service.login({ username: 'nonexistent', password: 'password' })).rejects.toThrow('Invalid credentials');
        });
    });
});
