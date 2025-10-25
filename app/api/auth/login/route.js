import { NextResponse } from 'next/server';

// Mock user data - in a real app, this would come from a database
const users = [
  { id: 1, email: 'admin@example.com', password: 'password123', name: 'Admin User' },
  { id: 2, email: 'user@example.com', password: 'user123', name: 'Regular User' },
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = users.find(u => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In a real app, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Generate a JWT token
    // 3. Set secure HTTP-only cookies
    // 4. Store session data

    // For now, return success with user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      // In production, you would return a token here
      token: 'mock-jwt-token-' + user.id
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
