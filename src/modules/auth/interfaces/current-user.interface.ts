export interface ICurrentUser {
  userId: string;
  keycloakId: string;
  username: string;
  email: string;
  roles: string[];
}
