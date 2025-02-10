import { Users } from "../entities/userEntity";
import { AppDataSource } from "../db.config";
import { Quotes } from "../entities/quoteEntity";

const quoteRepo = AppDataSource.getRepository(Quotes);
const userRepo = AppDataSource.getRepository(Users);

const quoteResolvers = {
    Query: {
        quotes: async (_: any, { first = 6, after }: { first: number, after?: string }) => {
            const totalCount = await quoteRepo.count();
        
            const query = quoteRepo
                .createQueryBuilder("quote")
                .leftJoinAndSelect("quote.user", "user")
                .orderBy("quote.id", "ASC")
                .take(first + 1); 
        
            if (after) { 
                const afterNumber = parseInt(after, 10); 
                query.andWhere("quote.id > :after", { after: afterNumber });
            }

            const quotes = await query.getMany();
            const hasNextPage = quotes.length > first;
        
            if (hasNextPage) {
                quotes.pop(); 
            }
        
            return {
                edges: quotes.map((quote) => ({
                    node: quote,
                    cursor: quote.id.toString(), 
                })),
                pageInfo: {
                    hasNextPage,
                    startCursor: quotes.length > 0 ? quotes[0].id.toString() : null,
                    endCursor: quotes.length > 0 ? quotes[quotes.length - 1].id.toString() : null,
                },
                totalCount,
            };
        }                    
    },

    Mutation: {
        createQuote: async (_: any, { name }: { name: string }, { userId }: { userId: number }) => {
            if (!userId) {
                throw new Error("You must be logged in!");
            }

            const user = await userRepo.findOne({ where: { id: userId } });

            if (!user) {
                throw new Error("User not found!");
            }

            const newQuote = quoteRepo.create({
                name,
                user, 
            });

            return await quoteRepo.save(newQuote);
        },
    },
};

export default quoteResolvers;
