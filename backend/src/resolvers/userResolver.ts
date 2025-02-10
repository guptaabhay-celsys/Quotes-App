import { Users } from "../entities/userEntity";
import { Quotes } from "../entities/quoteEntity";
import { AppDataSource } from "../db.config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(Users);
const quoteRepo = AppDataSource.getRepository(Quotes);
const JWT_SECRET = '12345';

const userResolvers = {
    Query: {
        users: async () => {
            return await userRepo.find();
        },

        user: async (_: any, { id }: { id: number }) => {
            return await userRepo.findOne({ where: {id: id} });
        },

        myprofile: async(_: any, args: any, {userId}: { userId: number }) => {
            if(!userId)
                throw new Error('You must be logged in.')
                return await userRepo.findOne({ where: {id: userId} })
        }
    },

    User: {
        quotes: async (user: Users) => {
            return await quoteRepo.find({ where: { user: { id: user.id } } });
        }
    },

    Mutation: {
        signupUser: async (_: any, { userNew }: { userNew: { firstName: string; lastName: string; email: string; password: string } }) => {

            const existingUser = await userRepo.findOne({ where: {email: userNew.email} });
            if (existingUser) {
                throw new Error("User with this email already exists!");
            }

            const hashedPassword = await bcrypt.hash(userNew.password, 10);

            const newUser = userRepo.create({ ...userNew, password: hashedPassword });
            await userRepo.save(newUser);

            return newUser;
            },
        
        loginUser: async (_: any, { userLog }: { userLog: { email: string, password: string }}) => {
            const userExists = await userRepo.findOne({ where: {email: userLog.email} });

            if(!userExists)
                throw new Error('Email Id does not exists. Please try with a new email id');

            
            const user = userExists;

            const isPasswordValid = await bcrypt.compare(userLog.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid Email or Password');
            }

            const token = jwt.sign(
                { userId: user.id, userName: user.firstName },
                JWT_SECRET,
                { expiresIn: '1h' })
                
            return {user, token};
        }
        }
};

export default userResolvers;
