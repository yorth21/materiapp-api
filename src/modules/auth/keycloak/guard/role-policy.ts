
export const RolePolicies = {
  schools: ['realm:admin'], // Solo admin puede acceder al módulo de escuelas
  users: ['realm:admin', 'realm:manager'],
  courses: ['realm:user'],
  'student-courses': ['realm:student', 'realm:admin'],
  programs: ['realm:admin'],
  curricula: ['realm:user'],

};
// @Roles({ roles: ['realm:admin'] }) 