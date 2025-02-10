import { gql } from "apollo-server-core";

const typeDefs = gql`
    type Query {
        users: [User]
        quotes(first: Int, after: String): QuoteConnection!
        user(id: ID!): User!
        myprofile: User!
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        quotes: [Quote] 
    }

    type Quote {
        id: ID!
        name: String!
        user: User!
    }

    type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: String!
        endCursor: String!
    }

    type QuoteEdge {
        cursor: String!
        node: Quote!
    }

    type QuoteConnection {
    edges: [QuoteEdge]!
    pageInfo: PageInfo!
    totalCount: Int! 
}

    type Mutation {
        signupUser(userNew: signupUserInput!): User
        loginUser(userLog: loginUserInput!): Token
        createQuote(name: String!): Quote
    }

    type Token {
        user: User!
        token: String!
    }
    
    input loginUserInput {
        email: String!
        password: String!
    }

    input signupUserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }
`;

export default typeDefs;
