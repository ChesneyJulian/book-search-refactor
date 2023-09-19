// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // look into CONTEXT EXAMPLE 25 AND BEGINNING OF CLASS LAST NIGHT
    me: async ( user = null, params) => {
      const foundUser = await User.findOne({
        _id: user ? user._id : params.id, 
        or: { username: params.username }
      })
      if (!foundUser) {
        return res.status(400).json({ message: 'Cannot find a user with this id!' });
      }
      return res.json(foundUser);
    }
  },
  Mutation: {

    addUser: async ({ body }, res) => {
      const user = await User.create({ body });

      if (!user) {
        return res.status(400).json({ message: 'Something is wrong!' });
      }
      const token = signToken(user);
      return res.json({ token, user });
    },

    loginUser: async ({ body }, res) => {
      const user = await User.findOne({ 
        username: body.username,
        or: { email: body.email }
      })
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
      }

      const token = signToken(user);
      return res.json({ token, user });
    },

    saveBook: async ({ user, body }, res) => {
      console.log(user);
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        )
        return res.json(updatedUser);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },

    removeBook: async ({ user, params }, res) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id }, 
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if(!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
      }
      return res.json(updatedUser);
    }
  }
};

module.exports = resolvers;