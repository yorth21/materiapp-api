# 🔐 Inicio de Sesión con Keycloak en MateriApp

## 📍 URL de autenticación local

El inicio de sesión del sistema **MateriApp** se realiza a través de la interfaz de autenticación de **Keycloak** en el siguiente enlace:

http://localhost:8080/realms/materiapp-realm/login-actions/authenticate?client_id=materiap-backend&tab_id=mZqQ3HOsbtg


> 💡 **Nota:** La URL anterior es generada dinámicamente por Keycloak y puede cambiar en cada sesión.  
> Sin embargo, el patrón base es siempre el mismo:
> ```
> http://localhost:8080/realms/materiapp-realm/login-actions/authenticate
> ```

---

### 🔧 Configuración técnica

- **Servidor Keycloak:** `http://localhost:8080`
- **Realm:** `materiapp-realm`
- **Client ID:** `materiap-backend`
- **Flujo de autenticación:** `Standard flow` (Authorization Code)
- **Protocolo:** `OpenID Connect (OIDC)`

## ⚙️ Funcionamiento en entorno local

Actualmente, el proyecto está configurado para usar **Keycloak como servidor de autenticación** en `localhost`, utilizando el **realm**:

### 🔄 Flujo del login

1. El usuario accede a una ruta protegida del backend (NestJS).
2. El backend redirige automáticamente a la interfaz de **login de Keycloak** (la URL mostrada arriba).
3. Keycloak valida las credenciales del usuario.
4. Si el login es exitoso, Keycloak genera un **token JWT** (Access Token + Refresh Token).
5. El backend valida el token recibido y concede acceso a los recursos protegidos.

## 💻 Interfaz de autenticación

La interfaz de inicio de sesión y registro es **la predeterminada de Keycloak**, sin modificaciones.  
Esto significa que:
- La UI (HTML, CSS, JS) proviene del tema por defecto de Keycloak.
- El frontend del proyecto **no maneja aún el login directamente**.
- Toda la autenticación ocurre desde la página servida por Keycloak.

## 🚀 Próximos pasos

En versiones futuras, el **login y registro** podrán implementarse directamente desde el **frontend en Angular**, utilizando los endpoints del realm `materiapp-realm`.  
De esta manera, la autenticación se integrará de forma más fluida dentro del diseño del sistema, sin depender del tema visual de Keycloak.

---

## 🧠 Resumen

| Elemento                | Valor o Descripción                             |
|--------------------------|--------------------------------------------------|
| Servidor Keycloak        | `http://localhost:8080`                         |
| Realm                    | `materiapp-realm`                               |
| Client ID                | `materiap-backend`                              |
| URL base de autenticación| `/realms/materiapp-realm/login-actions/authenticate` |
| Estado actual            | Login con interfaz predeterminada de Keycloak   |
| Próximo paso             | Integrar login y register desde Angular         |

---

📅 **Última actualización:** _(3 nov 2025)_