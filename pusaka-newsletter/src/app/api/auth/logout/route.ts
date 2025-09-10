import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (token) {
      try {
        // Verify and decode token
        const decoded = verifyToken(token)
        
        // Remove session from database
        await prisma.session.deleteMany({
          where: {
            userId: decoded.userId,
            token: token
          }
        })
      } catch (error) {
        // Token might be invalid, but we still want to clear the cookie
        console.log('Token verification failed during logout:', error)
      }
    }

    // Create response
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    })

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // This expires the cookie immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
