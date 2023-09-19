const gql = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Integer
    savedBooks: [Book]
  }
  type Book {
    bookId: Integer!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String 
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username:String!, email: String!, password: String!): Auth
    #look into input types for saveBook
    saveBook(authors: [String], description: String!, title: String!, bookId: String!, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`

module.exports = typeDefs;