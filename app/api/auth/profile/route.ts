import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PUT(request: NextRequest) {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    const body = await request.json()
    const { username, email, address, city, state, zipCode, country } = body

    if (!username || !email) {
      return NextResponse.json({ message: "Username and email are required" }, { status: 400 })
    }

    const updatedUser = await db.user.update({
      where: { id: decoded.id },
      data: {
        username,
        email,
        address,
        city,
        state,
        zipCode,
        country,
      },
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

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
  }
}
