# Proyecto 1 Backend

Se debe definir la variable de entorno CONNECTION_STRING para conectarse a una instancia de MongoDB.
Cree un archivo llamado .env con la definición de dicha variable de entorno.

```console
CONNECTION_STRING="mongodb+srv://<user>:<password>@cluster0.lvwps5p.mongodb.net/?retryWrites=true&w=majority"
```

Para iniciar el servidor ejecute los comandos:

```console
npm install
npm start
```

Para iniciar el servidor en modo desarrollador ejecute:

```console
npm run dev
```

Se necesita tener instalado el compilador de typescript para ejecutar el servidor:

```console
npm install typescript --save-dev
```

Para acceder a la documentación de la API y probar las rutas, ingrese al al URL [http://localhost:8000/docs](http://localhost:8000/docs) despues de iniciar el servidor.
