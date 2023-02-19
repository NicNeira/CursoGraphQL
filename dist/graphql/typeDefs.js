export const typeDefs = `
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
