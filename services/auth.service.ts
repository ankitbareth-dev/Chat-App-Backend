import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { SignupInput, LoginInput, AuthResponse } from "../types/auth.types";
import { generateAvatarUrl } from "../utils/generateAvatar";
import env from "../utils/envVariable";

const signToken = (id: string, phone: string) => {
  return jwt.sign({ userId: id, phone }, env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const signupUser = async (data: SignupInput): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      throw new AppError(409, "Email is already registered.");
    }
    throw new AppError(409, "Phone number is already registered.");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  const defaultProfilePic = generateAvatarUrl(data.name);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        profilePicture: defaultProfilePic,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        createdAt: true,
      },
    });

    return {
      ...newUser,
      profilePicture: newUser.profilePicture || generateAvatarUrl(newUser.name),
    };
  } catch (error) {
    console.error("DB Error:", error);
    throw new AppError(500, "Failed to create user. Please try again.");
  }
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { phone: data.phone },
  });

  if (!user) {
    throw new AppError(404, "User not found with this phone number.");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid phone or password.");
  }

  const token = signToken(user.id, user.phone);

  const userWithoutPassword: AuthResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profilePicture: user.profilePicture || generateAvatarUrl(user.name),
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, token };
};

export const checkUserStatus = async (
  userId: string,
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

  return {
    ...user,
    profilePicture: user.profilePicture || generateAvatarUrl(user.name),
  };
};
