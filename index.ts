import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import { PubSub } from 'graphql-subscriptions';
import  mongoose  from 'mongoose';
import CommentMoongose from './models/Comment.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB = process.env.MONGODB
const port = 4000;

// necesitaremos los typeDefs y resolvers
const typeDefs = `
  type Comment {
    name: String!
    endDate: String!
  }

  type Query {
    getComments(id: ID!): Comment
  }

  type Mutation {
    createComment(name: String!): String!
  }

  type Subscription {
    commentAdded: Comment!
  }

`
const pubSub = new PubSub();

const resolvers = {
  Query: {
    getComments:async (_, {id}) =>  await CommentMoongose.findById(id)
    
  },
  Subscription: {
    commentAdded: {
      // cuando se suscriba a este evento, se ejecutara este resolver
      subscribe: () => {
        // Por convencion siempe en mayusculas
        return pubSub.asyncIterator(['COMMENT_CREATED']);
      }
    }
  },
  Mutation: {
    async createComment(parent, {name}){
      // obtener la fecha actual
      const endDate = new Date().toDateString();

      // crear el comentario
      const newComment = new CommentMoongose({name: name, endDate: endDate})

      // Guardar en la base de datos
      const response = await newComment.save()

      pubSub.publish('COMMENT_CREATED', { commentAdded: { 
          name, endDate: endDate
        }}) 

        return `Comment: ${name} created}`

      }
  }
}

// generar el schema con typeDefs y resolvers
// lo que hace makeExecutableSchema es generar el schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// apoyo en express para ejecutar el servidor
const app = express();

// crear servidor http
const httpServer = createServer(app);


// websocket
const wsServer = new WebSocketServer({ 
  server: httpServer,
  path: '/graphql'
 });

//  limpiar el contenido del servidor
const wsServerCleanup = useServer({schema}, wsServer)

// servicio de apollo
const apolloServer = new ApolloServer({ 
  schema,
  plugins: [
    // plugin para tirar abajo servicio http
    ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // plugin para tirar abajo el servicio de websockets
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            }
          }
        } 
      } 
  ]
});

// ejecutar el servidor de apollo
await apolloServer.start();

// sirve para que el servidor de apollo pueda recibir peticiones
app.use("/graphql", bodyParser.json(), expressMiddleware(apolloServer));

// Conexion a MONGODB
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB);

// listen
httpServer.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}/graphql`);
});
