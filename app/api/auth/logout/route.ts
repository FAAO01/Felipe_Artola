import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout exitoso" })

  response.cookies.set("aut-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  })

  return response
}
