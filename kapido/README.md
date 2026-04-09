# Kapido — K-Expiration Control


Kapido K-Expiration Control — Memoria Técnica



Fase 1: Gestión de Empleados

Antes de comenzar el desarrollo de la aplicación K-Expiration Control, el proyecto ya contaba con una base funcional de gestión de empleados implementada durante una etapa previa. A continuación se describen todos los componentes:

1.1 Entidad Empleado y enumerado CargoEmpleado

La entidad principal de esta base es Empleado. Esta clase representa la tabla Empleados en la base de datos y contiene los campos: identificador autogenerado, nombre, apellidos, DNI cargo y estado activo o inactivo. Todos los campos de texto cuentan con anotaciones de validación (@NotBlank, @NotNull) que impiden guardar registros con datos vacíos, mostrando mensajes de error descriptivos.

El campo cargo es de tipo enumerado CargoEmpleado, definido en CargoEmpleado.java, con tres valores posibles que representan los puestos laborales de la empresa: CAJERO, GERENTE y JEFE_DE_TIENDA. Se almacena en base de datos como cadena de texto gracias a la anotación @Enumerated(EnumType.STRING).

1.2 Repositorio de Empleado

Se implementó la interfaz EmpleadoRepository, en EmpleadoRepository.java. Esta interfaz extiende JpaRepository de Spring Data JPA, lo que proporciona automáticamente todas las operaciones básicas de base de datos (buscar todos, buscar por id, guardar, eliminar).

1.3 Servicio de Empleado

Se definió la interfaz EmpleadoService en EmpleadoService.java, con los métodos findAll(), findById(), save(), update() y delete(). Esta clase contiene la lógica de negocio: para las operaciones de actualización y borrado, primero verifica que el empleado existe antes de modificarlo, lanzando una excepción controlada si no se encuentra.

1.4 Objeto de transferencia de datos (DTO) y Mapper

Para evitar exponer directamente la entidad de base de datos a través de la API. La clase EmpleadoDTO, en EmpleadoDTO.java, es una representación simplificada del empleado que contiene únicamente los campos necesarios para la comunicación con el cliente: id, nombre, apellidos, dni, cargo y activo.

La conversión entre entidad y DTO se realiza mediante la clase EmpleadoMapper. Esta clase contiene dos métodos: toDTO() que convierte una entidad Empleado en un EmpleadoDTO, y toEntity() que realiza la conversión inversa.

1.5 Controlador REST de Empleado

El controlador EmpleadoController, en EmpleadoController.java, expone la API REST del módulo de empleados bajo el path /api/empleados. Implementa los cinco endpoints estándar de un CRUD completo.

Fase 2: Autenticación y Autorización mediante JWT

2.0 Configuración del proyecto — pom.xml

Para empezar el proyecto modifiqué el fichero  pom.xml, adapte las dependencias para el tipo de proyecto que quiero plantear, usar SpringBoot como BackEnd, Angular como FrontEnd y MySql como gestor de información. Eliminé las dependencias de Thymeleaf ya que el Front será gestionado por Angular y la persistencia de datos recaerá sobre MySql, importe la libreria de jwt-api, jjwt-impl y jjwt-jackson. Estas librerías permiten generar, firmar y validar los tokens JSON Web Token (JWT) que se utilizarán para autenticar las peticiones HTTP entre Angular y Spring Boot.

2.1. Modelo de datos: roles y usuario

Se creó el enum de RolUsuario, que define los tres tipos de trabajadores que contempla la aplicación: CAJERO_REPONEDOR, GESTOR y JEFE_TIENDA. Esta separación de roles es la base del sistema de autorización, que determinará a qué recursos puede acceder cada tipo de usuario.

A continuación se creó la entidad Usuario. Esta clase representa la tabla usuarios en la base de datos MySQL y contiene los campos: identificador autogenerado (id), nombre completo (nombre), correo electrónico único (email), contraseña hasheada (password), rol asignado (rol) y un campo booleano para indicar si la cuenta está activa (activo). El campo email se define como único en la base de datos para evitar duplicados. La contraseña nunca se almacena en texto plano, sino cifrada mediante el algoritmo BCrypt.

2.3. Acceso a datos: repositorio de usuario

Se creó la interfaz UsuarioRepository. Esta interfaz extiende JpaRepository de Spring Data JPA, lo que proporciona automáticamente los métodos básicos de consulta (buscar, guardar, eliminar) sin necesidad de escribir SQL. Adicionalmente, se declaró el método findByEmail(String email), se utiliza durante el proceso de login para localizar al usuario por su correo electrónico.

2.4. Capa de servicio: carga del usuario para Spring Security

Cree UsuarioService, que extiende la interfaz UserDetailsService de Spring Security. Esta extensión al parecer es obligatoria para integrar la carga de usuarios con el sistema de seguridad de Spring.

https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html?utm_source=copilot.com

La implementación concreta se encuentra en UsuarioServiceImpl.java. El método principal es loadUserByUsername(String email), al que Spring Security llama internamente cada vez que necesita verificar la identidad de un usuario. Este método busca al usuario en la base de datos por su email y, si lo encuentra, devuelve un objeto UserDetails con sus credenciales y su rol. Si el usuario no existe, lanza una excepción UsernameNotFoundException.


2.5. Seguridad: generación y validación de tokens JWT

La clase JwtUti es la responsable de todo lo relacionado con los tokens JWT (importante). Sus tres funciones principales son: 

Generar un token firmado con el email del usuario y su rol, con una expiración configurable (por defecto 24 horas)

Extraer el email del usuario a partir de un token recibido.

Validar que un token tiene una firma correcta y no ha expirado. 

La clave secreta de firma y el tiempo de expiración se leen desde el archivo application.properties mediante la anotación @Value, lo que permite modificarlos sin tocar el código.

Se creó también el filtro JwtAuthenticationFilter, en JwtAuthenticationFilter.java. Este componente se ejecuta automáticamente en cada petición HTTP antes de que llegue al controlador. Su función es leer la cabecera Authorization de la petición, extraer el token Bearer, validarlo con JwtUtil y, si es correcto, establecer la autenticación del usuario en el contexto de seguridad de Spring. De esta forma, todas las peticiones quedan autenticadas sin necesidad de mantener una sesión en el servidor.

2.6. Configuración de seguridad

Creé SecurityConfig para dejar la API funcionando solo con JWT. Ahora todo es en teoria independiente y no requiere almacenar informacion sobre las sesiones de usuarios, así que cada petición necesita su propio token.

Registre JwtAuthenticationFilter para que Spring valide el token antes de procesar la petición, y añadí un BCryptPasswordEncoder para manejar las contraseñas de forma segura y no se muestren tal cual..

2.7. Endpoint de login

Controlador AuthController.  Este controlador expone el endpoint POST /api/auth/login, que es el único punto de entrada público de la API. Recibe la petición de un JSON con email y password, delega la verificación en el AuthenticationManager de Spring Security, y si las credenciales son correctas genera un token JWT y lo devuelve en la respuesta junto con el email y el rol del usuario. Este token es el que Angular almacenará en localStorage y enviará en la cabecera Authorization de todas las peticiones posteriores.

2.8. Inicialización de datos de prueba

Clase DataInitializer. Esta clase implementa CommandLineRunner, lo que hace que Spring Boot la ejecute automáticamente cada vez que arranca la aplicación. Su función es comprobar si la tabla de usuarios está vacía y, de ser así, insertar tres usuarios de prueba con contraseña cifrada.

2.9. Configuración de la aplicación

Incluí los parámetros necesarios de JWT: jwt.secret (la clave secreta de firma, de mínimo 32 caracteres) y jwt.expiration (el tiempo de validez del token en ms, configurado a 86.400.000 ms, equivalente a 24 horas)

