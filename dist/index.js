// Describiendo servidor apollo
// Origen de datos
import { GraphQLError } from "graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v1 as uuid } from "uuid";
// Directivas
// Sistema para insertar usuarios
const usuarios = [
    {
        id: 1,
        name: "Juan",
        lastName: "Perez",
        street: "Calle 1",
        zipCode: 20010,
        city: "Ciudad 1",
        phone: "123456789"
    },
    {
        id: 2,
        name: "Pedro",
        lastName: "Gomez",
        street: "Calle 2",
        zipCode: 20020,
        city: "Ciudad 2",
        phone: "987654321"
    }
];
// Definicion de tipos, Aqui no tenemos EndPoints, solo definimos los tipos de datos que vamos a utilizar
const typeDefs = `
  type Usuario {
    id: ID!
    name: String!
    lastName: String!
    street: String!
    zipCode: Int!
    city: String!
    phone: String
    address: String
  }

  type Query {
    allUsuarios: [Usuario]
    countUsuarios: Int! @deprecated(reason: "Use userLength instead")
    userLength: Int!
    findUsuarioByName(name: String!): Usuario
    findUsuarioById(id: ID!): Usuario
  }

  # Mutation agrega o modifica datos
  type Mutation {
    addUsuario(
      name: String!, 
      lastName: String!, 
      street: String!, 
      zipCode: Int!, 
      city: String!, 
      phone: String): Usuario
  }
`;
// Resolvers, aqui es donde se definen las acciones que se van a realizar
const resolvers = {
    Usuario: {
        // parent para referirnos al objeto de la composicion
        address: (parent) => {
            return `${parent.street}, ${parent.zipCode}, ${parent.city}`;
        }
    },
    Query: {
        // Devolvemos todos los usuarios
        allUsuarios: () => usuarios,
        // Contamos los usuarios
        countUsuarios: () => usuarios.length,
        userLength: () => usuarios.length,
        // Buscamos por nombre
        findUsuarioByName: (parent, args) => {
            return usuarios.find(usuario => usuario.name === args.name);
        },
        // Buscamos por id
        findUsuarioById: (parent, args) => {
            return usuarios.find(usuario => usuario.id === parseInt(args.id));
        }
    },
    Mutation: {
        addUsuario: (parent, args) => {
            // Comprobamos que no exista el usuario
            if (usuarios.find(usuario => usuario.name === args.name)) {
                // Lanzamos un error
                throw new GraphQLError('El usuario ya existe en el sistema', {
                    extensions: {
                        // Codigo de error
                        code: 'BAD_USER_INPUT'
                    }
                });
            }
            // Creamos el usuario
            const usuario = {
                id: uuid(),
                name: args.name,
                lastName: args.lastName,
                street: args.street,
                zipCode: args.zipCode,
                city: args.city,
                phone: args.phone
            };
            // Añadimos el usuario a la lista de usuarios
            usuarios.push(usuario);
            // Devolvemos el usuario
            return usuario;
        }
    }
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
