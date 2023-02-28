const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
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
            const dataPassword = await user.isCorrectPassword(password);
            if(!dataPassword) {
                throw new AuthenticationError('Incorrect password')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            }
            throw new AuthenticationError("Please log in");
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
              );
              return updatedUser;
            }
          },
    }

};

module.exports = resolvers;