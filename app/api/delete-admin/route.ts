import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert, getApps } from "firebase-admin/app";

// Initialize Firebase Admin SDK
let isInitialized = false;

function initializeFirebaseAdmin() {
  if (isInitialized || getApps().length > 0) {
    return;
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables",
      );
    }

    const parsedKey = JSON.parse(serviceAccountKey);

    initializeApp({
      credential: cert(parsedKey),
    });

    isInitialized = true;
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error: any) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Firebase Admin on each request
    initializeFirebaseAdmin();

    const { adminUid } = await request.json();

    if (!adminUid) {
      return NextResponse.json(
        { error: "Admin UID is required" },
        { status: 400 },
      );
    }

    // Delete user from Firebase Authentication
    await getAuth().deleteUser(adminUid);

    return NextResponse.json(
      { message: "Admin deleted successfully from authentication" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to delete admin from authentication",
        details:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 },
    );
  }
}
