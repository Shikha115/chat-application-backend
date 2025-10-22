import { comparePassword, hashPassword } from "@/helpers/bcrypt";
import { generateToken } from "@/helpers/jwt";
import User from "@/models/user.model";
import { NextFunction, Request, Response } from "express";

export const getAllData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      res.status(404);
      throw new Error("No users found");
    }
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    next(err);
  }
};


export const getByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.params;

    const pipeline = [
      {
        $match: {
          _id: { $ne: req.user._id },
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ];

    const user = await User.aggregate(pipeline);

    if (!user || user.length === 0) {
      res.status(404);
      throw new Error("No users found");
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    next(err);
  }
};
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    next(err);
  }
};


export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all the fields");
    }

    const exist = await User.findOne({ email });
    if (exist) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    const picPath = req.file ? `${req.file.filename}` : undefined;
    console.log(req.file);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      pic: picPath,
    });

    if (!user) {
      res.status(500);
      throw new Error("User registration failed");
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (!exist) {
      res.status(401);
      throw new Error("User not found");
    }
    if (!comparePassword(password, exist.password)) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken({ id: exist._id });

    res.status(200).json({
      message: "User authenticated successfully",
      data: {
        user: {
          _id: exist._id,
          name: exist.name,
          email: exist.email,
          pic: exist.pic,
          isAdmin: exist.isAdmin,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteAllData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      res.status(404);
      throw new Error("No users found");
    }
    await User.deleteMany({});
    res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    next(err);
  }
};
