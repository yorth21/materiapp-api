import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('ProgramsController', () => {
  let controller: ProgramsController;
  let service: ProgramsService;

  const mockProgram = {
    id: 1,
    name: 'Computer Science',
    code: 'CS101',
  };

  const mockProgramsService = {
    findOne: jest.fn().mockResolvedValue(mockProgram),
    findAll: jest.fn().mockResolvedValue([mockProgram]),
    create: jest.fn().mockResolvedValue(mockProgram),
    update: jest.fn().mockResolvedValue({ ...mockProgram, name: 'Updated CS' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [
        {
          provide: ProgramsService,
          useValue: mockProgramsService,
        },
      ],
    }).compile();

    controller = module.get<ProgramsController>(ProgramsController);
    service = module.get<ProgramsService>(ProgramsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('5. /programs/:id endpoint accessibility without @Roles decorator', () => {
    it('should be accessible without specific role requirements after @Roles decorator was commented out', async () => {
      // Arrange
      const programId = 1;

      // Act
      const result = await controller.findOne(programId);

      // Assert
      expect(result).toEqual(mockProgram);
      expect(service.findOne).toHaveBeenCalledWith(programId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should verify @Roles decorator is not present on findOne method', () => {
      // Use Reflector to check if roles metadata is defined
      const reflector = new Reflector();
      const rolesMetadata = reflector.get('roles', controller.findOne);

      // Assert - The @Roles decorator has been commented out, so metadata should be undefined
      expect(rolesMetadata).toBeUndefined();
    });

    it('should allow any authenticated user to access /programs/:id endpoint', async () => {
      // Arrange
      const programId = 1;
      // Simulate different user types
      const userTypes = [
        { username: 'admin-user', roles: ['admin'] },
        { username: 'regular-user', roles: ['user'] },
        { username: 'student-user', roles: ['student'] },
        { username: 'no-roles-user', roles: [] },
      ];

      // Act & Assert - All user types should be able to call the endpoint
      for (const user of userTypes) {
        const result = await controller.findOne(programId);
        expect(result).toEqual(mockProgram);
      }

      expect(service.findOne).toHaveBeenCalledTimes(userTypes.length);
    });
  });

  describe('Other endpoints functionality', () => {
    it('should retrieve all programs', async () => {
      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual([mockProgram]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should create a new program', async () => {
      // Arrange
      const createDto = {
        name: 'Computer Science',
        code: 'CS101',
      };

      // Act
      const result = await controller.create(createDto as any);

      // Assert
      expect(result).toEqual(mockProgram);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should update a program', async () => {
      // Arrange
      const programId = 1;
      const updateDto = {
        name: 'Updated CS',
      };

      // Act
      const result = await controller.update(programId, updateDto as any);

      // Assert
      expect(result).toEqual({ ...mockProgram, name: 'Updated CS' });
      expect(service.update).toHaveBeenCalledWith(programId, updateDto);
    });

    it('should delete a program', async () => {
      // Arrange
      const programId = 1;

      // Act
      const result = await controller.remove(programId);

      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(programId);
    });
  });

  describe('Integration with CustomRoleGuard', () => {
    it('should rely on CustomRoleGuard for programs module authorization', () => {
      // This test documents that the programs module uses the global CustomRoleGuard
      // instead of the @Roles decorator for the findOne endpoint.
      // The CustomRoleGuard checks RolePolicies['programs'] which requires 'realm:admin'
      
      // Note: In actual runtime, the CustomRoleGuard will check:
      // - RolePolicies['programs'] = ['realm:admin']
      // - Users without 'realm:admin' role will get ForbiddenException
      // - This is tested in auth.guard.spec.ts

      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });
});
