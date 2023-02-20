const { AuthenticationError } = require('apollo-server-express');
const { models } = require('mongoose');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return await User.find({}).populate('savedBooks');
        }
    }
};

module.exports = resolvers;