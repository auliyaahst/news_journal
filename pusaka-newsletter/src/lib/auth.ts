import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

export async function createUser(data: {
  email: string
  password: string
  name: string
  phone?: string
}) {
  const hashedPassword = await hashPassword(data.password)
  
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      subscription: {
        create: {
          plan: 'FREE_TRIAL',
          status: 'TRIAL',
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months
        }
      }
    },
    include: {
      subscription: true
    }
  })
}