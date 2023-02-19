// Describiendo servidor apollo
// Origen de datos
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from 'node-fetch';
const typeDefs = `
  type Usuario {
    id: ID!
    name: String!
    lastName: String!
    street: String
    zipCode: Int
    city: String
    phone: String
    address: String 
  }

  type Query {
    allUsuarios: [Usuario]
  }

`;
const resolvers = {
    Usuario: {
        // parent para referirnos al objeto de la composicion
        address: (parent) => {
            return `${parent.street}, ${parent.zipCode}, ${parent.city}`;
        }
    },
    Query: {
        // Devolvemos todos los usuarios
        allUsuarios: async () => {
            // TODO: Obtener los usuarios de la base de datos
            const url = 'https://nn-graphql-example-default-rtdb.firebaseio.com/usuarios/users.json';
            const rowResponse = await fetch(url);
            const response = await rowResponse.json();
            return response["-NOenJcwYI4Ha10BMTrr"];
        }
    },
};
// Instanciamos nuestro servidor que sera un nuevo apollo server
// Agregamos la configuracion de nuestro servidor que hemos escrito previamente
const server = new ApolloServer({ typeDefs, resolvers });
// Levantamos el servicio en el puerto 4000
// Obtenemos la url de la accion desestructurando el objeto
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log(`🚀 Server ready at ${url}`);
// Lo probamos con `npm start` y nos devuelve los libros que tenemos en duro en el playground de apollo/server
