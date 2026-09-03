# 🌿 MexNature — Plataforma Turística

Aplicación web **Full-Stack** para explorar destinos turísticos y rutas en México. Integra una interfaz dinámica en Angular, una API REST en .NET 8 y capacidades de **Inteligencia Artificial** para generar descripciones automáticas de los lugares.

![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
![.NET](https://img.shields.io/badge/.NET%208-512BD4?style=flat&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=flat&logo=csharp&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=flat&logo=microsoftsqlserver&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)

> **ℹ️ Nota sobre el entorno en la nube**
> Anteriormente este proyecto estuvo desplegado en **Railway** (servicios Dockerizados + SQL Server). Actualmente los servidores públicos están **en pausa**, pero el proyecto está diseñado para levantarse fácilmente en cualquier entorno local usando Docker.

---

## 📑 Tabla de contenidos

- [Tecnologías usadas](#️-tecnologías-usadas)
- [Arquitectura del sistema](#️-arquitectura-del-sistema)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución](#-instalación-y-ejecución-entorno-local)
  - [Paso 1 — Base de datos con Docker](#paso-1--levantar-la-base-de-datos-con-docker)
  - [Paso 2 — Backend (.NET 8)](#paso-2--configurar-y-ejecutar-el-backend-net-8)
  - [Paso 3 — Frontend (Angular)](#paso-3--configurar-y-ejecutar-el-frontend-angular)
- [Resumen de puertos](#-resumen-de-puertos)
- [Comandos útiles de Docker](#-comandos-útiles-de-docker)
- [Solución de problemas](#-solución-de-problemas)

---

## 🛠️ Tecnologías usadas

El proyecto está dividido en dos repositorios principales: **Frontend** y **Backend**.

### Frontend (Web)

| Componente | Tecnología |
|---|---|
| Framework | Angular |
| Lenguaje | TypeScript |
| Estilos | HTML5, CSS3 |
| Contenedores | Docker (Dockerfile configurado para servir con Nginx/Node) |

### Backend (API)

| Componente | Tecnología |
|---|---|
| Framework | .NET 8 (ASP.NET Core Web API) |
| Lenguaje | C# |
| ORM | Entity Framework Core |
| Integración de IA | SDK de OpenAI (modelos GPT) |
| Documentación | Swagger / OpenAPI |
| Contenedores | Docker |

### Base de datos & DevOps

| Componente | Tecnología |
|---|---|
| Base de datos | Microsoft SQL Server (Dockerizado) |
| CI/CD | GitHub Actions (pipelines de despliegue continuo) |
| Cloud Hosting | Railway (histórico) |

---

## 🏗️ Arquitectura del sistema

El proyecto sigue un modelo **Cliente-Servidor** con una arquitectura moderna y escalable:

1. **Patrón RESTful** — El backend expone endpoints REST seguros y bien estructurados, documentados automáticamente con Swagger.

2. **Uso de DTOs (Data Transfer Objects)** — Se implementaron DTOs para evitar ciclos de referencia (errores de serialización JSON) y separar la capa de datos (entidades de base de datos) de la capa de presentación.

3. **Code-First & Auto-Migraciones** — La base de datos fue diseñada mediante código (Entity Framework Code-First). La API cuenta con un script de inicio que ejecuta las migraciones y crea la base de datos automáticamente al arrancar.

4. **Resiliencia (ingeniería de fallback)** — El servicio de Inteligencia Artificial (`AiService`) implementa un patrón *try-catch* seguro. Si la API de OpenAI falla (por *timeout*, permisos o saldo), el sistema intercepta el error y devuelve una respuesta predeterminada (*fallback*), manteniendo la API estable y evitando errores 500 (**Status 200 OK garantizado**).

```
┌─────────────────┐        HTTP/REST        ┌──────────────────┐
│    Frontend     │ ──────────────────────► │     Backend      │
│    Angular      │ ◄────────────────────── │  ASP.NET Core 8  │
│  localhost:4200 │         JSON            │  localhost:5141  │
└─────────────────┘                         └────────┬─────────┘
                                                     │
                                    ┌────────────────┴────────────────┐
                                    │                                 │
                                    ▼                                 ▼
                           ┌──────────────────┐            ┌──────────────────┐
                           │   SQL Server     │            │   OpenAI API     │
                           │  Docker :1433    │            │  (+ fallback)    │
                           └──────────────────┘            └──────────────────┘
```

---

## 📋 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 20.x | `docker --version` |
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | 8.0 | `dotnet --version` |
| [Node.js](https://nodejs.org/) | 18.x o superior | `node --version` |
| [Angular CLI](https://angular.dev/tools/cli) | 17.x o superior | `ng version` |

Si no tienes Angular CLI, instálalo de forma global:

```bash
npm install -g @angular/cli
```

---

## 🚀 Instalación y ejecución (entorno local)

### Paso 1 — Levantar la base de datos con Docker

No necesitas instalar SQL Server localmente. Ejecuta este comando en tu terminal para crear el contenedor:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password123!" \
  -p 1433:1433 \
  --name sqlserver-mexnat \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

> **Windows (CMD / PowerShell):** escribe el comando en una sola línea, sin las barras invertidas `\`.

Verifica que el contenedor esté corriendo:

```bash
docker ps
```

Deberías ver `sqlserver-mexnat` con el estado `Up`.

---

### Paso 2 — Configurar y ejecutar el Backend (.NET 8)

**1. Clona el repositorio del backend:**

```bash
git clone https://github.com/TU_USUARIO/mexnature-backend.git
cd mexnature-backend
```

**2. Configura `appsettings.Development.json`**

Asegúrate de que la cadena de conexión apunte a tu Docker local y agrega tu llave de OpenAI (opcional):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MexNatureDB;User Id=sa;Password=Password123!;TrustServerCertificate=True"
  },
  "OpenAI": {
    "ApiKey": "TU_API_KEY_DE_OPENAI"
  }
}
```

> **La llave de OpenAI es opcional.** Si la omites o es inválida, el `AiService` devolverá descripciones predeterminadas gracias al mecanismo de *fallback*, y la aplicación seguirá funcionando con normalidad.

**3. Restaura las dependencias y ejecuta la API:**

```bash
dotnet restore
dotnet run
```

> **Nota:** al arrancar, el sistema creará automáticamente la base de datos `MexNatureDB` y sus tablas mediante las migraciones de Entity Framework. No necesitas ejecutar `dotnet ef database update` manualmente.

**4. Verifica que la API esté activa** abriendo Swagger en tu navegador:

```
https://localhost:7198/swagger
```

---

### Paso 3 — Configurar y ejecutar el Frontend (Angular)

**1. Clona el repositorio del frontend:**

```bash
git clone https://github.com/TU_USUARIO/mexnature-frontend.git
cd mexnature-frontend
```

**2. Instala las dependencias:**

```bash
npm install
```

**3. Apunta el frontend a tu API local**

En `src/environments/environment.ts` (o directamente en los servicios), configura la URL de la API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7198/api'  // o 'http://localhost:5141/api'
};
```

**4. Inicia el servidor de desarrollo:**

```bash
ng serve
```

**5. Abre tu navegador en:**

```
http://localhost:4200
```

---

## 🔌 Resumen de puertos

| Servicio | URL / Puerto |
|---|---|
| Frontend (Angular) | `http://localhost:4200` |
| Backend HTTPS | `https://localhost:7198` |
| Backend HTTP | `http://localhost:5141` |
| Swagger UI | `https://localhost:7198/swagger` |
| SQL Server | `localhost,1433` |

---

## 🐳 Comandos útiles de Docker

```bash
# Detener el contenedor de la base de datos
docker stop sqlserver-mexnat

# Volver a iniciarlo (conserva los datos)
docker start sqlserver-mexnat

# Ver los logs del contenedor
docker logs sqlserver-mexnat

# Eliminar el contenedor (⚠️ se pierden los datos)
docker rm -f sqlserver-mexnat
```

---

## 🔧 Solución de problemas

| Problema | Solución |
|---|---|
| **El backend no conecta con la base de datos** | Verifica con `docker ps` que `sqlserver-mexnat` esté `Up`. El contenedor tarda unos segundos en aceptar conexiones tras iniciarse. |
| **Error de certificado HTTPS en .NET** | Ejecuta `dotnet dev-certs https --trust`. |
| **Errores de CORS desde Angular** | Confirma que `http://localhost:4200` esté incluido en la política de CORS del backend (`Program.cs`). |
| **El puerto 1433 ya está en uso** | Tienes otra instancia de SQL Server activa. Deténla o mapea otro puerto: `-p 1434:1433` (y ajusta la cadena de conexión). |
| **Las descripciones de IA salen genéricas** | Es el comportamiento esperado del *fallback*. Revisa que tu `ApiKey` de OpenAI sea válida y tenga saldo disponible. |

---

<div align="center">

**🌿 MexNature** — Explora México, naturalmente.

</div>



















# MexNatureWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



