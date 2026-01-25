import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import env from "../utils/envVariable";

export const signupUser = async (data: any) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { phone: data.phone },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, token };
};
