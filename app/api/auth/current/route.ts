import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

// JWT secret key (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = (await cookies()).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      username: string
      email: string
    }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          country: true,
        },
      })

    if (!user) {
      // Clear the invalid token
      (await
        // Clear the invalid token
        cookies()).set({
        name: "auth_token",
        value: "",
        httpOnly: true,
        path: "/",
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    // Return user data
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth verification error:", error)

    // Clear the invalid token
    ;(await
      // Clear the invalid token
      cookies()).set({
      name: "auth_token",
      value: "",
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }
}
