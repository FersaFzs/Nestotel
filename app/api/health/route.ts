import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db/mongoose';

export async function GET() {
  try {
    // Check database connection
    await dbConnect();
    
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'MONGODB_URI',
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );
    
    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: 'warning',
          message: 'Missing environment variables',
          missing: missingEnvVars,
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : 'Internal error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
} 