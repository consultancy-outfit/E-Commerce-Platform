import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Role } from '../common/roles';

describe('AuthService', () => {
  let users: { findByEmail: jest.Mock; create: jest.Mock };
  let jwt: { sign: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    users = { findByEmail: jest.fn(), create: jest.fn() };
    jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
    service = new AuthService(users as never, jwt as never);
  });

  it('hashes the password and never stores plain text on signup', async () => {
    users.findByEmail.mockResolvedValue(null);
    users.create.mockImplementation((data) =>
      Promise.resolve({ _id: 'u1', ...data, role: Role.Customer }),
    );

    const dto = { email: 'a@b.com', password: 'password123', firstName: 'A', lastName: 'B' };
    const result = await service.signup(dto);

    const stored = users.create.mock.calls[0][0];
    expect(stored.passwordHash).toBeDefined();
    expect(stored.passwordHash).not.toBe(dto.password);
    expect(await bcrypt.compare(dto.password, stored.passwordHash)).toBe(true);
    expect(stored.role).toBe(Role.Customer); // signup cannot self-assign admin
    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate email with 409', async () => {
    users.findByEmail.mockResolvedValue({ _id: 'existing' });
    await expect(
      service.signup({ email: 'a@b.com', password: 'password123', firstName: 'A', lastName: 'B' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects wrong password with 401', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    users.findByEmail.mockResolvedValue({
      _id: 'u1',
      email: 'a@b.com',
      passwordHash,
      firstName: 'A',
      lastName: 'B',
      role: Role.Customer,
    });
    await expect(
      service.login({ email: 'a@b.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects unknown email with 401', async () => {
    users.findByEmail.mockResolvedValue(null);
    await expect(
      service.login({ email: 'nobody@b.com', password: 'whatever' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
