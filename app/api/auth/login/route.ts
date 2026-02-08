import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/lib/models';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    // Hash the provided password
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    
    // Find admin with matching credentials
    const admin = await Admin.findOne({
      username,
      password: hashedPassword
    });
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
