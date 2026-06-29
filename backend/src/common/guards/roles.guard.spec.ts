import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '../roles';

function contextWith(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => undefined,
    getClass: () => undefined,
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const makeGuard = (required?: Role[]) => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(required) } as unknown as Reflector;
    return new RolesGuard(reflector);
  };

  it('allows when no roles are required', () => {
    expect(makeGuard(undefined).canActivate(contextWith({ role: Role.Customer }))).toBe(true);
  });

  it('allows an admin into an admin-only route', () => {
    expect(makeGuard([Role.Admin]).canActivate(contextWith({ role: Role.Admin }))).toBe(true);
  });

  it('blocks a customer from an admin-only route', () => {
    expect(() =>
      makeGuard([Role.Admin]).canActivate(contextWith({ role: Role.Customer })),
    ).toThrow(ForbiddenException);
  });

  it('blocks an unauthenticated request', () => {
    expect(() => makeGuard([Role.Admin]).canActivate(contextWith(undefined))).toThrow(
      ForbiddenException,
    );
  });
});
