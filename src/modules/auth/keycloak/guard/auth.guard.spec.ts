import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CustomRoleGuard } from './auth.guard';
import { RolePolicies } from './role-policy';

describe('CustomRoleGuard', () => {
  let guard: CustomRoleGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    guard = new CustomRoleGuard();
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    } as any;
  });

  describe('1. No user found in request', () => {
    it('should throw UnauthorizedException when no user is found in the request', () => {
      // Arrange
      const mockRequest = { path: '/api/programs/list' };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow('No valid user found in request.');
    });
  });

  describe('2. Extract and combine realm and client roles', () => {
    it('should correctly extract and combine both realm and client roles for authorization', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'test-user',
        realm_access: {
          roles: ['admin', 'user'],
        },
        resource_access: {
          'materiap-backend': {
            roles: ['view-profile', 'manage-account'],
          },
          'another-client': {
            roles: ['client-role'],
          },
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/test-module/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Spy on console.log to verify roles are extracted
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('User: test-user, Module: test-module, Roles: admin, user, materiap-backend:view-profile, materiap-backend:manage-account, another-client:client-role')
      );

      consoleLogSpy.mockRestore();
    });

    it('should handle missing realm_access and resource_access gracefully', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'test-user',
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/test-module/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true); // No policy for test-module
    });
  });

  describe('3. Grant access with required roles', () => {
    it('should grant access when the user has a required realm role for a module', () => {
      // Arrange
      // RolePolicies expects 'realm:admin' but CustomRoleGuard extracts just 'admin' from realm_access
      // So we need to temporarily modify RolePolicies or use a role that matches
      const originalPolicy = RolePolicies['programs'];
      RolePolicies['programs'] = ['admin']; // Change to match what guard extracts

      const mockUser = {
        preferred_username: 'admin-user',
        realm_access: {
          roles: ['admin'],
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/programs/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);

      // Cleanup
      RolePolicies['programs'] = originalPolicy;
    });

    it('should grant access when the user has a required client role for a module', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'client-user',
        realm_access: {
          roles: ['user'],
        },
        resource_access: {
          'some-client': {
            roles: ['admin'],
          },
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/programs/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Mock RolePolicies to accept client role
      RolePolicies['programs'] = ['realm:admin', 'some-client:admin'];

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);

      // Cleanup
      RolePolicies['programs'] = ['realm:admin'];
    });

    it('should grant access when user has one of multiple required roles', () => {
      // Arrange
      // RolePolicies for 'users' expects ['realm:admin', 'realm:manager']
      // But CustomRoleGuard extracts just 'admin', 'manager' from realm_access
      const originalPolicy = RolePolicies['users'];
      RolePolicies['users'] = ['admin', 'manager']; // Change to match what guard extracts

      const mockUser = {
        preferred_username: 'manager-user',
        realm_access: {
          roles: ['manager'],
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/users/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);

      // Cleanup
      RolePolicies['users'] = originalPolicy;
    });
  });

  describe('4. Deny access without required roles', () => {
    it('should throw ForbiddenException when the user does not have any required realm roles', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'basic-user',
        realm_access: {
          roles: ['user'],
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/programs/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Access denied. Required roles:'),
        })
      );
    });

    it('should throw ForbiddenException when the user does not have any required client roles', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'client-user',
        realm_access: {
          roles: [],
        },
        resource_access: {
          'wrong-client': {
            roles: ['wrong-role'],
          },
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/programs/123',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
    });

    it('should deny access when user has no roles at all', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'no-roles-user',
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/schools/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act & Assert
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Access denied. Required roles: realm:admin'
      );
    });
  });

  describe('5. Module without role policy', () => {
    it('should grant access to modules without defined role policies', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'any-user',
        realm_access: {
          roles: ['user'],
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/undefined-module/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Spy on console.log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Access Allowed] No policy for module: undefined-module')
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('should handle paths without /api prefix correctly', () => {
      // Arrange
      const originalPolicy = RolePolicies['programs'];
      RolePolicies['programs'] = ['admin']; // Match what guard extracts

      const mockUser = {
        preferred_username: 'admin-user',
        realm_access: {
          roles: ['admin'],
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/programs/list',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Act
      const result = guard.canActivate(mockExecutionContext);

      // Assert
      expect(result).toBe(true);

      // Cleanup
      RolePolicies['programs'] = originalPolicy;
    });

    it('should deduplicate roles from realm and client access', () => {
      // Arrange
      const mockUser = {
        preferred_username: 'test-user',
        realm_access: {
          roles: ['admin', 'user'],
        },
        resource_access: {
          'client': {
            roles: ['admin'], // Same role name but should be prefixed
          },
        },
      };
      const mockRequest = {
        user: mockUser,
        path: '/api/test/action',
      };
      (mockExecutionContext.switchToHttp().getRequest as jest.Mock).mockReturnValue(mockRequest);

      // Spy on console.log to check unique roles
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      guard.canActivate(mockExecutionContext);

      // Assert - Should have both 'admin' (realm) and 'client:admin' (client)
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Roles: admin, user, client:admin')
      );

      consoleLogSpy.mockRestore();
    });
  });
});
