import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function registerUser(req, res) {
  try {
    const { firstName, lastName, email, phoneNo, password, role = 'VENDOR' } = req.body;

    // Check if all required fields are present
    if (!firstName || !lastName || !email || !phoneNo || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists. Please log in.' });
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with hashed password
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNo,
        password: hashedPassword,
        role
      }
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}
