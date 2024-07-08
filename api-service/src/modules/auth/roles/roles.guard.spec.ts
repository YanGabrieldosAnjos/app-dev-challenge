import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RoleGuard } from './roles.guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        Reflector,
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should throw UnauthorizedException if user role does not match any of the allowed roles', () => {
      const allowedRoles = ['admin'];
      const mockContext = createMockExecutionContext(allowedRoles, 'user');
      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
    });
  });

  function createMockExecutionContext(roles: string[], userRole: string = 'user'): ExecutionContext {
    const mockRequest = {
      user: { role: userRole },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => {
        if(roles.length === 0){
          return true;
        }  

        return roles.some(role => role === role)
      },
    } as unknown as ExecutionContext;
  }
});
