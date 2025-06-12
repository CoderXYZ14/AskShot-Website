import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  
  // Return the session data (excluding sensitive information)
  return NextResponse.json({
    authenticated: true,
    user: session.user
  });
}
