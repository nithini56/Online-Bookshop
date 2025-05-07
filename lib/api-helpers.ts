import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// JWT secret key (should be in .env file in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Cache API responses
export const cacheResponse = (ttl = 60) => {
  return {
    "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 2}`,
  }
}

// Get authenticated user from token
export const getAuthUser = async () => {
  try {
    const token = (await cookies()).get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string
      username: string
      email: string
    }

    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    }
  } catch (error) {
    console.error("Error getting auth user:", error)
    return null
  }
}

// Format API error response
export const formatError = (message: string, status = 400) => {
  return {
    error: {
      message,
      status,
    },
  }
}
