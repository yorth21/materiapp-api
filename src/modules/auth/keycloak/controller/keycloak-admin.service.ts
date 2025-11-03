import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateUserDto } from '../dto/create-user.dto';

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
    const tokenUrl = `${this.configService.get<string>(
      'KEYCLOAK_BASE_URL',
    )}/realms/${this.realm}/protocol/openid-connect/token`;

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const res = await axios.post(tokenUrl, params);
    return res.data.access_token;
  }

  async createUser(userData: CreateUserDto) {
  try {
    const token = await this.getToken();

    const userRes = await axios.post(
      `${this.baseUrl}/${this.realm}/users`,
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

    const location = userRes.headers.location;
    const userId = location?.split('/').pop();

    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario creado');
    }

    // Buscar rol "user"
    const realmRolesRes = await axios.get(
      `${this.baseUrl}/${this.realm}/roles`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const userRole = realmRolesRes.data.find((role) => role.name === 'user');
    if (!userRole) throw new Error('Realm Role "user" no encontrado en Keycloak');

    // Asignar rol al usuario
    await axios.post(
      `${this.baseUrl}/${this.realm}/users/${userId}/role-mappings/realm`,
      [userRole],
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error creating user in Keycloak:', error.response?.data || error.message);
    throw new Error('Error al crear el usuario en Keycloak');
  }
}
}
