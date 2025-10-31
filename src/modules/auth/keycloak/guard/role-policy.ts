
export const RolePolicies = {
  schools: ['realm:admin'], // Solo admin puede acceder al módulo de escuelas
  users: ['realm:admin', 'realm:manager'],
  courses: ['realm:teacher', 'realm:admin'],
  'student-courses': ['realm:student', 'realm:admin'],
};
