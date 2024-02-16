const User = require("../models/userModel");

const createUser = async (req, res) => {
  const { name, email, password, age, country } = req.body;

  // basic backend validation
  if (!name || !email || !password) {
    return res.status(500).json({
      message: "Name, email, password are required to create the user",
    });
  }

  //check if user already exist
  const usersExists = await User.findOne({ email });
  //if yes throw error
  if (usersExists) {
    return res.status(404).json({
      message: "Email has already been registered.",
    });
  }
  //create user
  //  I need the userId of the user to laterUpdate the user
  // for this the assumption is to split the email with @ an take the left
  //half of the email as userId:
  //eg: Email: user123@gmail.com , therefor userId will be: user123
  const customUserId = email.split("@")[0];
  console.log(customUserId);
  const user = await User.create({
    name,
    email,
    password,
    age,
    country,
    userId: customUserId,
  });
  //send response on successfull creation of the user
  if (user) {
    const { _id, name, email, age, country, userId } = user;
    res.status(201).json({
      _id,
      name,
      email,
      userId,
      age,
      country,
    });
  } else {
    return res.status(400).json({
      message: "Invalid user data",
    });
  }
  //     res.status(400);
  //     throw new Error("Invalid User Data");
  //   }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndUpdate({ userId }, req.body, {
      new: true,
      select: "-password",
    });
    if (!user) {
      return res.status(404).json({
        message: "No user found with the particular userId",
      });
    }
    console.log(user.name);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({
        message: "No user found",
      });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Assignment 4 aggegrate query:
const aggregateUserData = async (req, res) => {
  try {
    const aggregationResult = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          averageAge: { $avg: "$age" },
          usersByCountry: {
            $addToSet: {
              country: "$country",
              count: 1,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          averageAge: 1,
          usersByCountry: 1,
        },
      },
    ]);
    res.send(aggregationResult);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  aggregateUserData,
};
