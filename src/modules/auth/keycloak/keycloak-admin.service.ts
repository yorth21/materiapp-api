import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class KeycloakAdminService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private realm: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('KEYCLOAK_BASE_URL')!;
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID')!;
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET')!;
    this.realm = this.configService.get<string>('KEYCLOAK_REALM')!;
  }

  private async getToken(): Promise<string> {
    const res = await axios.post(
      `http://localhost:8080/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    );
    return res.data.access_token;
  }

  async createUser(userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const token = await this.getToken();

    const userRes = await axios.post(
      `${this.baseUrl}/users`,
      {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: userData.password,
            temporary: false,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const userId = userRes.headers.location.split('/').pop();

    const realmRolesRes = await axios.get(
      `${this.baseUrl}/roles`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const userRole = realmRolesRes.data.find((r) => r.name === 'user');

    if (!userRole) {
      throw new Error('Realm Role "user" no encontrado en Keycloak');
    }

    await axios.post(
      `${this.baseUrl}/users/${userId}/role-mappings/realm`,
      [userRole],
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return userRes.data;
  }
}
