# Curso de GraphQL GOGODEV
[Link al vido aqui!](https://www.youtube.com/watch?v=Y-KDpO24RC4&ab_channel=GOGODEV)

> En este curso completo de GraphQL con Apollo aprenderemos a desarrollar nuestros propios servicios de grafos, tanto en JavaScript como en TypeScript: typeDefs, resolvers, suscripciones, origen de datos por API, origen de datos SQL, origen de datos No SQL (MongoDB, Mongoose) todo recopilado en un único vídeo. Al final de esta formación, deberías ser capaz de construir tus propios servicios de grafos, incluyendo suscripciones. Además, durante el curso, realizarás dos ejemplos prácticos: Uno utilizando un origen de datos por API contra SQL, y otro de suscripciones contra MongoDB con Mongoose como ODM.

## Documentación importante
- [GraphQL](https://graphql.org/)
- [Apollo](apollographql.com/docs/apollo-server/getting-started/#step-2-install-dependencies)
- [MongoDB](https://www.mongodb.com/)

Para instalar las dependencias ejecutar
`npm i`

 - [x] Crear archivo `tsconfig.json` en el directorio raiz
<pre><code>
{ 
	"compilerOptions": { 
		"rootDirs": ["src"], 
		"outDir": "dist", 
		"lib": ["es2020"], 
		"target": "es2020", 
		"module": "esnext", 
		"moduleResolution": "node", 
		"esModuleInterop": true, 
		"types": ["node"] 
	}
}
</code></pre>
 - [x] si queremos trabajar con typscript debemos hacer una modificación en el `package.json` y modificamos la sección:
<pre><code>
"type": "module", 
	"scripts": { 
		"compile": "tsc", 
		"start": "npm run compile && node dist/index.js" 
	},
</code></pre>
 - [x] Creamos `index.ts`
 - [x] ejecutamos `npm start` y vemos que esta todo OK
