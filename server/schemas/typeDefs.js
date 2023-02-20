const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
}
type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}
type Auth {
    token: ID!
    user: User
}
input SavedBookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
}
type Query {
    users: [User]
    user(username: String!): User
    books: [Book]
}
type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: SavedBookInput): User
    removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;