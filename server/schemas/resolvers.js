// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    // query to find user's own profile using context provided from token and return data
    me: async (parent, args, context) => {
      try {
        const foundUser = await User.findOne({
          _id: context.user ? context.user._id : args.id, 
        })
        if (!foundUser) {
          throw AuthenticationError;
        }
        return foundUser;
      } catch (err) {
        console.error(err);
      }

    }
  },

  Mutation: {
    // mutation to add a user to the database and return the token and user
    addUser: async (parent, args) => {
      try {      
        // pass args from signup form to create a new User
        const user = await User.create(args);
        // check that user creation was successful
        if (!user) {
          throw AuthenticationError;
        }
        // sign JWT so user passes Auth when they create an account
        const token = signToken(user);
  
        return { token, user };
      } catch (err) {
        console.error(err);
      }
    },
    // mutation to login a user to their account and return token and user
    loginUser: async (parent, args) => {
      try {
          // pass args from login form to find a single User
        const user = await User.findOne({ 
          $or: [{username: args.username}, {email: args.email}]
        })
        // check that a user is found with the username or email given
        if (!user) {
          throw AuthenticationError;
        }
        // check user's entered password with the bcrypt hash password
        const correctPw = await user.isCorrectPassword(args.password);
        // throw error if incorrect password
        if (!correctPw) {
          throw AuthenticationError;
        }
        // sign token with user found from login
        const token = signToken(user);
  
        return { token, user };
      } catch (err) {
        console.error(err);
      }
    },
    // mutation to save a book to a user's account and return the updated user's account
    saveBook: async (parent, args, context) => {
      try {
        // find and update user using context and add saved book to savedBooks
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
    // mutation to remove book from user's savedBooks and return the updated user's account
    removeBook: async (parent, args, context) => {
      try {
        // find and update user using context and pull the deleted book from savedBooks
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id }, 
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        if(!updatedUser) {
          throw AuthenticationError;
        }
        return updatedUser;
      } catch (err) {
        console.error(err);
      }
    }
  }
};

module.exports = resolvers;