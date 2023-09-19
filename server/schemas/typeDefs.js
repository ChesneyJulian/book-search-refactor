const gql = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: Int
    authors: [String]
    description: String
    title: String
    image: String
    link: String 
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    me: User
  }

  input UserInput {
    username: String
    email: String
    password: String
  }

  input BookInput {
    authors: [String]
    description: String
    title: String
    bookId: String
    image: String
    link: String
  }
  type Mutation {
    loginUser(email: String, username: String, password: String): Auth
    addUser(input: UserInput!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: String): User
  }
`

module.exports = typeDefs;