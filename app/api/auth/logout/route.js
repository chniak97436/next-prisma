"use client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create response and redirect to login
    const response = NextResponse.redirect(new URL('/login', 'http://localhost:3001'));
    
    // Clear all authentication cookies by setting them with empty value and maxAge: 0
    response.cookies.set("token", "", { path: "/", maxAge: 0 });
    response.cookies.set("userId", "", { path: "/", maxAge: 0 });
    response.cookies.set("userRole", "", { path: "/", maxAge: 0 });
    response.cookies.set("userEmail", "", { path: "/", maxAge: 0 });
    response.cookies.set("userName", "", { path: "/", maxAge: 0 });
    response.cookies.set("cart", "", { path: "/", maxAge: 0 });
    
    return response;
    
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de la déconnexion" }, { status: 500 });
  }
}
