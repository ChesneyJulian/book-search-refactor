// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // look into CONTEXT EXAMPLE 25 AND BEGINNING OF CLASS LAST NIGHT
    me: async (parent, args, context) => {
      console.log(context.user);
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
      console.log(args);
      // pass args.input because we are using input types
      const user = await User.create(args);

      if (!user) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      console.log(token);
      return { token, user };
    },

    loginUser: async (parent, args) => {
      console.log(args.email, args.username, args.password);
      const user = await User.findOne({ 
        $or: [{username: args.username}, {email: args.email}]
      })
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      console.log(token);
      return { token, user };
    },

    saveBook: async (parent, args, context) => {
      console.log('ARGS ', args);
      console.log(context.user._id);
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
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