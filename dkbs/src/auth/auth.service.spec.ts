import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const email = 'teste@teste.com';
      const pass = '123456';
      const user = { id: 1, email: email, password: pass, role: 'admin' };

      (usersService.findAll as jest.Mock).mockResolvedValue([user]);

      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.signIn(email, pass);
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
