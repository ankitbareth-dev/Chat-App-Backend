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
    const err = new Error("User already exists");
    (err as any).statusCode = 404;
    throw err;
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
    const err = new Error("User not found");
    (err as any).statusCode(404);
    throw err;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    const err = new Error("Invalid credentials");
    (err as any).statusCode(400);
    throw err;
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
