const { AuthenticationError } = require('apollo-server-express');
const { models } = require('mongoose');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // users: async () => {
        //     return await User.find({}).populate('savedBooks');
        // }
        me: async (parent, args, context) => {
            if (context.user) {
                const data = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return data;
            }
            throw new AuthenticationError('Please log in');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError('Please enter a valid email address')
            }
            const dataPassword = await data.isCorrectPassword(password);
            if(!dataPassword) {
                throw new AuthenticationError('Incorrect password')
            }
            const token = signToken(user);
            return { token, user };
        }
    }

};

module.exports = resolvers;