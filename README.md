# Shortener Frontend

**Shortener Frontend** Es la parte del cliente de la aplicación Shortener, donde los usuarios pueden interactuar con la funcionalidad de acortar enlaces, ver estadísticas, configurar la seguridad de sus enlaces, autenticarse o añadir enlaces a su portfolio.

## Características

- **Interfaz para generar enlaces cortos**: Los usuarios pueden ingresar una URL y obtener un enlace corto.
- **Visualización de estadísticas**: Muestra el número de clics en los enlaces acortados.
- **Generación de código QR**: Permite a los usuarios generar un código QR para los enlaces acortados.
- **Autenticación de usuarios**: Los usuarios pueden iniciar sesión y mantener su sesión activa a través de tokens JWT.
- **Protección con reCAPTCHA**: Usamos Google reCAPTCHA para proteger formularios de spam.
- **Seguridad en los enlaces**: Los usuarios puede ponerle la seguridad que ellos quieran a sus enlaces
- **Portfolio**: Los usuarios mostraran los links que mas les gusten para que ellos mismos u otras personas puedan acceder fácilmente

## Tecnologías utilizadas

- **React**: Para la interfaz de usuario y la gestión de componentes.
- **Vite**: Herramienta de construcción para el desarrollo rápido de aplicaciones.
- **Axios**: Para realizar solicitudes HTTP al servidor backend.
- **Zustand**: Para gestionar el estado global de la autenticación de los usuarios.
- **qrcode.react**: Para generar códigos QR de los enlaces acortados.
- **reCAPTCHA**: Para proteger los formularios de spam y bots.

  [Documentacion](https://ubiquitous-barnacle-7k8kvjg.pages.github.io/global.html#LayoutPrivate)
