import express from 'express';
import { ApolloServer } from "apollo-server";
import typeDefs from './schemaGql';
import { AppDataSource } from './db.config';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist';
import quoteResolvers from "./resolvers/quoteResolver";
import userResolvers from "./resolvers/userResolver";
import { mergeResolvers } from '@graphql-tools/merge';
import "reflect-metadata";
import jwt from 'jsonwebtoken';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
const JWT_SECRET = '12345';

const resolver = mergeResolvers([quoteResolvers, userResolvers]);
 
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log(" Database connected successfully!");
 
        const server = new ApolloServer({
            typeDefs, 
            resolvers: resolver,
            cors: {
              origin: "*",
              credentials: true,
            },
            context: ({req}) => {
              const { authorization } = req.headers;
              if(authorization){
                const token = authorization.split(' ')[1];
  
                const { userId } = jwt.verify(token, JWT_SECRET) as {
                  userId : number,
                  userName: string,
                };
                return { userId };
              }
            },
            plugins: [
                ApolloServerPluginLandingPageGraphQLPlayground()
            ],
            formatError: (error) => {
                return {
                    message: error.message,
                    statusCode: error?.extensions?.statusCode || 500
                }
               
            }
        });
 
        server.listen(3000).then(({ url }) => {
            console.log(` YOUR SERVER IS RUNNING AT: ${url}`);
        });
    } catch (error) {
        console.error(" Error connecting to database:", error);
    }
};
 
startServer()
 