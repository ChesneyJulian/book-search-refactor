// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // look into CONTEXT EXAMPLE 25 AND BEGINNING OF CLASS LAST NIGHT
    me: async ( user = null, params) => {
      const foundUser = await User.findOne({
        _id: user ? user._id : params.id, 
        or: { username: params.username }
      })
      if (!foundUser) {
        throw AuthenticationError;
      }
      return foundUser;
    }
  },

  Mutation: {

    addUser: async ({ body }, res) => {
      const user = await User.create(body);

      if (!user) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    loginUser: async ({ body }, res) => {
      const user = await User.findOne({ 
        username: body.username,
        or: { email: body.email }
      })
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async ({ user, body }, res) => {
      console.log(user);
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        )
        return updatedUser;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    removeBook: async ({ user, params }, res) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id }, 
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if(!updatedUser) {
        throw AuthenticationError;
      }
      return updatedUser;
    }
  }
};

module.exports = resolvers;