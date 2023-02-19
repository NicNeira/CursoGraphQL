import fetch from 'node-fetch';
// Resolvers, aqui es donde se definen las acciones que se van a realizar
export const resolvers = {
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
            const url = 'https://nn-graphql-example-default-rtdb.firebaseio.com/usuarios.json';
            const rowResponse = await fetch(url);
            const response = await rowResponse.json();
            return response;
        }
    },
};
