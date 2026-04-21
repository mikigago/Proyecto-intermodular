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

Vídeo utilizado: 
https://www.youtube.com/watch?v=-Z4a0bKr2Pg&list=LL&index=1&t=664s

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

-- Corrección de bugs --

Antes de continuar con las siguientes fases, revisé el código y encontré varios problemas:

El primero y más importante era que en UsuarioServiceImpl estaba usando el método .roles() de Spring Security para asignar el rol al usuario autenticado, y ese método añade automáticamente el prefijo ROLE_ al nombre del rol (por ejemplo, GESTOR se convertía en ROLE_GESTOR). El problema es que en ProductoController los @PreAuthorize buscaban exactamente 'GESTOR' y 'JEFE_TIENDA' sin ese prefijo, así que Spring nunca encontraba la coincidencia y devolvía 403 Forbidden aunque el usuario tuviera el rol correcto. Lo solucioné cambiando .roles() por .authorities(), que asigna el nombre tal cual, sin añadir nada.

El segundo bug era que EmpleadoController no tenía ningún control de acceso. Cualquier usuario autenticado, incluso un cajero, podía crear, modificar o eliminar empleados. Añadí @PreAuthorize en todos los endpoints: GET, POST y PUT requieren GESTOR o JEFE_TIENDA, y DELETE solo JEFE_TIENDA.

El tercero era que ProductoServiceImpl lanzaba una RuntimeException genérica cuando no encontraba un producto por id. Eso hacía que GlobalExceptionHandler no pudiera capturarla y devolver un 404 limpio. Creé la clase ProductoNotFoundException (igual que ya existía EmpleadoNotFoundException) y la registré en el manejador global.

3.0 Entidad Producto + CRUD API REST

Con la autenticación funcionando, implementé el módulo central de la aplicación: el registro y gestión de productos con fecha de caducidad.

3.1 Modelo de datos: estado del producto y entidad Producto

Primero creé el enum EstadoProducto con los cuatro estados posibles que puede tener un producto a lo largo de su ciclo de vida en tienda: EN_STOCK (recién llegado y en buen estado), PROXIMO_CADUCAR (dentro del margen de días de aviso), CADUCADO (fecha de caducidad ya superada) y RETIRADO (retirado manualmente del sistema).

La entidad principal es Producto, en Producto.java, que representa la tabla productos en MySQL. Sus campos son: id autogenerado, nombre, numeroLote, codigoBarras (puede ser código de barras o QR), fechaLlegada, fechaCaducidad, estado (por defecto EN_STOCK) y registradoPor, que es una relación Many-to-One con Usuario para saber qué empleado registró cada producto.

3.2 Repositorio de Producto

La interfaz ProductoRepository extiende JpaRepository y añade tres consultas personalizadas que se usarán en las alertas: findByFechaCaducidadBefore() para encontrar productos ya caducados, findByFechaCaducidadBetween() para los próximos a caducar en un rango de fechas, y findByEstado() para filtrar por estado.

3.3 Servicio de Producto

La interfaz ProductoService define los métodos findAll(), findById(), save(), update() y delete(). La implementación en ProductoServiceImpl añade la lógica más importante: el método privado calcularEstado(), que antes de guardar o actualizar cualquier producto compara su fechaCaducidad con la fecha actual y los días configurados en ConfigAlerta para asignar automáticamente el estado correcto. El estado nunca lo envía el cliente, siempre lo calcula el servidor.

3.4 DTO y Mapper de Producto

ProductoDTO es la representación del producto que viaja entre el backend y Angular. Contiene todos los campos visibles más registradoPorId (solo el id del usuario, no el objeto completo) para evitar exponer datos innecesarios. ProductoMapper convierte entre entidad y DTO en ambos sentidos.

3.5 Controlador REST de Producto

ProductoController expone la API bajo /api/productos con control de acceso por rol en cada endpoint: GET (todos o por id) accesible para cualquier usuario autenticado, POST y PUT requieren GESTOR o JEFE_TIENDA, y DELETE solo JEFE_TIENDA. Al crear un producto, el controlador obtiene automáticamente el usuario autenticado del contexto de seguridad de Spring y lo asigna como registradoPor.

3.6 Configuración de alertas: ConfigAlerta

Creé la entidad ConfigAlerta, en ConfigAlerta.java, que representa una tabla de configuración global con un único registro (siempre id = 1). Su único campo relevante es diasPrevioAviso, que determina con cuántos días de antelación se considera que un producto está "próximo a caducar". Al arrancar la aplicación, DataInitializer comprueba si existe ese registro y si no lo crea con 7 días por defecto.

El motivo de usar id = 1 fijo es que esta tabla siempre tendrá una sola fila. No tiene sentido generar ids dinámicos para algo que nunca va a tener más de un registro. Es un patrón habitual para tablas de configuración global.

3.7 Servicio de alertas

AlertaService define cuatro métodos: findProductosProximosACaducar(), findProductosCaducados(), getDiasPrevioAviso() y setDiasPrevioAviso(). La implementación en AlertaServiceImpl lee los días configurados en ConfigAlerta (o usa 7 como fallback si no existe el registro) y usa las queries del ProductoRepository para devolver las listas de productos filtradas. Los productos en estado RETIRADO se excluyen siempre de los resultados.

ProductoServiceImpl también fue actualizado para consultar ConfigAlerta al calcular el estado de cada producto, en lugar del valor 7 que tenía hardcodeado.

3.8 Controlador de alertas

AlertaController expone cuatro endpoints bajo /api/alertas, todos protegidos para GESTOR y JEFE_TIENDA: GET /api/alertas (próximos a caducar), GET /api/alertas/caducados, GET /api/alertas/config (devuelve los días configurados) y PUT /api/alertas/config (actualiza los días, solo JEFE_TIENDA).

4.0 Frontend Angular — Kapido

Con el backend completo y funcional, desarrollé el frontend en Angular 21 para consumir la API REST y ofrecer una interfaz de usuario al personal de tienda.

4.1 Estructura del proyecto Angular

El proyecto se generó con Angular CLI y sigue una arquitectura modular feature-based. Las carpetas principales dentro de src/app son:

- core/ — servicios singleton, interceptores, guards y modelos. Todo lo que es transversal a la aplicación.
- features/ — módulos de funcionalidad: auth (login), dashboard y productos. Cada uno tiene su propio NgModule con lazy loading.
- shared/ — componentes reutilizables.

4.2 Modelos de datos

Se definieron dos ficheros de modelos TypeScript que mapean exactamente las respuestas del backend:

usuario.model.ts define el tipo RolUsuario ('CAJERO_REPONEDOR' | 'GESTOR' | 'JEFE_TIENDA') y las interfaces LoginRequest y LoginResponse, que representan el cuerpo de la petición de login y la respuesta con el token JWT, el email y el rol.

producto.model.ts define el tipo EstadoProducto con los cuatro valores posibles (EN_STOCK, PROXIMO_CADUCAR, CADUCADO, RETIRADO) y la interfaz Producto con todos sus campos, siendo id, codigoBarras, estado y registradoPorId opcionales.

4.3 Servicios

AuthService gestiona toda la lógica de autenticación: llama al endpoint POST /api/auth/login, almacena el token JWT junto con el email y el rol en localStorage al hacer login, y los elimina al hacer logout. También expone métodos isLoggedIn(), getToken(), getRol() y getEmail() para que el resto de la aplicación pueda consultar el estado de la sesión.

ProductoService centraliza las cinco llamadas HTTP al endpoint /api/productos: getAll(), getById(), create(), update() y delete(). El token JWT se añade automáticamente por el interceptor, por lo que este servicio no necesita gestionar cabeceras manualmente.

AlertaService gesiona las llamadas al endpoint /api/alertas para obtener productos próximos a caducar, productos ya caducados, la configuración de días de aviso y su actualización.

4.4 Interceptor JWT

JwtInterceptor es un HttpInterceptor que se ejecuta automáticamente antes de cada petición HTTP. Lee el token del localStorage y, si existe, lo añade a la cabecera Authorization con el formato Bearer {token}. Así ningún servicio ni componente necesita recordar añadir la cabecera manualmente.

4.5 Guard de autenticación

AuthGuard implementa CanActivate y protege las rutas que requieren login. Comprueba si existe un token en localStorage y, si la ruta tiene la propiedad data.roles definida, verifica además que el rol del usuario esté en la lista permitida. Si alguna comprobación falla, redirige al login.

4.6 Módulo de autenticación (login)

AuthModule carga de forma lazy la ruta /login. El componente LoginComponent presenta un formulario con email y contraseña que llama a AuthService.login(). Si las credenciales son correctas, guarda la sesión y redirige al dashboard. Si el usuario tiene rol CAJERO_REPONEDOR, se le informa de que no tiene acceso a la aplicación web y se cierra la sesión.

4.7 Módulo Dashboard

DashboardModule carga de forma lazy la ruta /dashboard, protegida por AuthGuard para GESTOR y JEFE_TIENDA. DashboardComponent muestra tres secciones: tarjetas de resumen con el número de productos próximos a caducar y caducados, una tabla de productos próximos a caducar y otra de productos ya caducados. Si el usuario es JEFE_TIENDA, aparece adicionalmente un panel para cambiar los días de aviso previo llamando al endpoint PUT /api/alertas/config.

4.8 Módulo de Productos

ProductosModule carga de forma lazy la ruta /productos, también protegida por AuthGuard. Contiene dos componentes:

ProductoListComponent muestra todos los productos en una tabla con su estado coloreado mediante badges. Permite navegar al formulario de edición y, solo si el usuario es JEFE_TIENDA, muestra un botón para eliminar cada producto.

ProductoFormComponent es un formulario reutilizable para crear y editar productos. Si la ruta incluye un parámetro :id, se carga el producto existente (modo edición). Si no, el formulario aparece vacío (modo creación). Los campos obligatorios son nombre, número de lote, fecha de llegada y fecha de caducidad; el código de barras es opcional.

4.9 Configuración del módulo raíz y routing

AppModule registra BrowserModule, el módulo de routing y los providers necesarios. El routing principal en AppRoutingModule define cuatro rutas: la raíz redirige a /login, /login carga AuthModule, /productos carga ProductosModule y /dashboard carga DashboardModule. Las dos últimas usan canActivate con AuthGuard y la propiedad data.roles para controlar el acceso por rol. Cualquier ruta desconocida redirige al login.

4.10 Estilos: Bootstrap 5 y sistema de clases propio

Para los estilos del frontend se optó por Bootstrap 5.3 como librería base. Se instaló como dependencia npm (bootstrap: ^5.3.8) y se importa globalmente en styles.css, lo que hace que sus clases utilitarias estén disponibles en todos los componentes sin necesidad de importarla individualmente.

Bootstrap se usa principalmente para clases utilitarias puntuales: fw-semibold para texto en negrita, spinner-border para el spinner de carga, alert y alert-danger para los mensajes de error, y p-0 para eliminar el padding interno de los paneles de tabla.

Sin embargo, la mayor parte del diseño visual de la aplicación no usa los componentes de Bootstrap directamente sino un sistema de clases CSS propio con el prefijo kap-, definido en el archivo CSS de cada componente. Este prefijo actúa como espacio de nombres para evitar colisiones con Bootstrap u otras librerías. Las clases propias cubren el layout general (kap-layout, kap-sidebar, kap-main), las tarjetas de resumen del dashboard (kap-stat-card, kap-stat-warning, kap-stat-danger...), los paneles de tabla (kap-panel, kap-panel-header, kap-table), los badges de estado de producto (kap-badge, badge-en-stock, badge-caducado...) y los chips de stock (kap-stock-chip, kap-stock-warn, kap-stock-lost).

Esta combinación permite aprovechar las utilidades y el sistema de reset de Bootstrap sin depender de sus componentes visuales, manteniendo un diseño propio y consistente en toda la aplicación.

-- Corrección de bugs en el Frontend --

Bug 1 — Productos no se mostraban en la vista (HttpClientModule deprecado)

Tras arrancar el frontend, la pantalla de productos se quedaba indefinidamente en el spinner de carga. Examinando el Network del navegador se comprobó que la petición HTTP a /api/productos llegaba correctamente al backend y este respondía con los datos, pero Angular no ejecutaba el callback next del subscribe.

El problema era que en Angular 17+ el uso de HttpClientModule en el array imports del NgModule está deprecado y no inicializa correctamente el sistema de interceptores basado en HTTP_INTERCEPTORS. Lo soluccioné eliminando HttpClientModule de imports y añadiendo provideHttpClient(withInterceptorsFromDi()) al array providers. El método withInterceptorsFromDi() es el que activa la compatibilidad con los interceptores de clase registrados mediante el token HTTP_INTERCEPTORS.

Bug 2 — La vista no se actualizaba aunque los datos llegasen correctamente

Incluso después del fix anterior, los datos llegaban al componente (verificado en consola con console.log) pero el spinner seguía visible y la tabla no aparecía. El motivo era que provideHttpClient ejecuta las respuestas HTTP fuera de la zona de Angular (NgZone), por lo que el ciclo de detección de cambios no se disparaba automáticamente al recibir los datos.

La solución fue inyectar ChangeDetectorRef en ProductoListComponent y llamar a this.cdr.detectChanges() justo después de asignar los datos en el callback next y también en el callback error, forzando así a Angular a revisar y actualizar la vista.


-- Corrección de bugs en el Dashboard (16/04/2026) --

Bug 3 — El dashboard se quedaba colgado en "Cargando alertas..." sin mostrar nunca los datos ni ningún error

Al acceder a /dashboard la pantalla mostraba el spinner indefinidamente aunque el backend respondía correctamente a los tres endpoints de alertas (/api/alertas, /api/alertas/caducados y /api/alertas/config).

La causa raíz era doble:

Primero, DashboardComponent lanzaba tres llamadas HTTP independientes con subscribe() separados. La variable cargando solo se ponía a false dentro del callback de la tercera llamada (getCaducados). Si esa petición fallaba silenciosamente o se completaba fuera del orden esperado, el spinner nunca desaparecía y ningún mensaje de error se mostraba al usuario.

Segundo, aunque los datos llegaban correctamente al componente (verificable en la pestaña Network del navegador), Angular 21 utiliza la fetch API internamente para las peticiones HTTP en lugar de XMLHttpRequest. Esto hace que las respuestas lleguen fuera de la zona de Angular (NgZone), por lo que el motor de detección de cambios no se disparaba automáticamente al actualizar las propiedades del componente, y la vista se quedaba congelada en el estado inicial de cargando = true.

La solución se aplicó en dos pasos:

El primero fue sustituir los tres subscribe() independientes por un único forkJoin({ config, proximos, caducados }), que lanza las tres peticiones en paralelo y emite un único resultado cuando todas completan. Esto garantiza que cargando siempre cambia de estado al terminar, tanto si tiene éxito como si falla alguna petición.

El segundo fue añadir el operador finalize() de RxJS en la cadena del observable, que se ejecuta siempre al completarse el stream independientemente del resultado, y dentro de él llamar a this.cdr.detectChanges() (ChangeDetectorRef inyectado en el constructor) para forzar a Angular a revisar y renderizar los cambios en la vista.

Bug 4 — El interceptor JWT no manejaba respuestas de error del servidor

El JwtInterceptor original solo añadía el token a las peticiones salientes pero no gestionaba las respuestas de error. Si el token estaba expirado o era inválido, el backend devolvía 401 o 403 pero el frontend no hacía nada: la petición quedaba colgada o fallaba silenciosamente sin redirigir al usuario al login.

Se añadió un operador catchError() en el interceptor que captura cualquier HttpErrorResponse con status 401 o 403, limpia los datos de sesión del localStorage (token, email y rol) y redirige automáticamente al usuario a /login. Para el resto de errores, relanza el error mediante throwError() para que los componentes puedan gestionarlo con normalidad.


-- Mejoras del Dashboard (21/04/2026) --

Mejora 1 — Tarjeta de resumen: Stock perdido

Se añadió una nueva tarjeta de resumen al panel de control del dashboard que muestra el total de unidades de stock perdido. La propiedad stockPerdido se calcula en DashboardComponent sumando el campo cantidadActual de todos los productos cuyo estado es CADUCADO o RETIRADO. El cálculo se realiza en el mismo forkJoin que ya cargaba el resto de datos, sin llamada adicional al backend. La tarjeta se muestra con un borde morado para distinguirla visualmente de las demás y el subtexto "Unidades caducadas o retiradas".

Mejora 2 — Columna "Stock perdido" en la tabla de Productos caducados

Se añadió la columna Stock perdido a la tabla de productos caducados del dashboard. Por cada producto caducado se muestra el valor de cantidadActual (las unidades que quedaban en stock en el momento de la caducidad) dentro de un chip de color rojo (kap-stock-lost). Si el producto no tiene cantidad registrada, se muestra un guión. El colspan del mensaje de "sin productos" se actualizó de 4 a 5 para cubrir la nueva columna.

