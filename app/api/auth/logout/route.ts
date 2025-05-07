import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear the auth token cookie
  (await
    // Clear the auth token cookie
    cookies()).set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Expired time in the past
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  return NextResponse.json({ message: "Logged out successfully" })
}
