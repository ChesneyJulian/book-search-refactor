// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // look into CONTEXT EXAMPLE 25 AND BEGINNING OF CLASS LAST NIGHT
    me: async (parent, args, context) => {
      const foundUser = await User.findOne({
        _id: context.user ? context.user._id : args.id, 
        $or: { username: context.user ? context.user.username : args.username }
      })
      if (!foundUser) {
        throw AuthenticationError;
      }
      return foundUser;
    }
  },

  Mutation: {

    addUser: async (parent, args) => {
      console.log(args.input);
      const user = await User.create(args.input);

      if (!user) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    loginUser: async (parent, { email, username, password }) => {
      const user = await User.findOne({ 
        username: username,
        or: { email: email }
      })
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { body }, context) => {
      console.log(context.user);
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        )
        return updatedUser;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    removeBook: async (parent, { user, params }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id }, 
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