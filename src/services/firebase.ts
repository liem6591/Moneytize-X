import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Single authorized admin email address
export const AUTHORIZED_ADMIN_EMAIL = 'liem6591@gmail.com';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific databaseId as required by AI Studio skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Error handling interface according to Firebase integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on startup per Firebase skill guideline
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline. Check network and configuration.');
    }
    return false;
  }
}

// Admin Auth Helper Functions
export interface AdminAuthResult {
  success: boolean;
  user: User | null;
  error?: string;
}

/**
 * Sign in Admin using Google Popup.
 * Strictly verifies that the email matches AUTHORIZED_ADMIN_EMAIL.
 * If unauthorized, immediately terminates the session.
 */
export async function signInAdminWithGoogle(): Promise<AdminAuthResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userEmail = (user.email || '').toLowerCase().trim();
    const authorizedEmail = AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim();

    if (userEmail !== authorizedEmail) {
      // Unauthorized account detected - immediately sign out
      await signOut(auth);
      return {
        success: false,
        user: null,
        error: `Access Denied: The account "${user.email}" does not have administrator privileges. Only the designated administrator is authorized to sign in.`,
      };
    }

    // Record login timestamp in Firestore for authorized admin
    try {
      await setDoc(
        doc(db, 'admins', user.uid),
        {
          email: user.email,
          role: 'admin',
          lastLoginAt: new Date().toISOString(),
          serverUpdated: serverTimestamp(),
          uid: user.uid,
        },
        { merge: true }
      );
    } catch (writeErr) {
      console.warn('Could not write admin audit record:', writeErr);
      // Non-fatal for auth login itself
    }

    return {
      success: true,
      user,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'An error occurred during Google authentication.';
    return {
      success: false,
      user: null,
      error: message,
    };
  }
}

/**
 * Sign out Admin
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to admin auth state changes
 */
export function subscribeToAdminAuth(
  callback: (user: User | null, unauthorizedError?: string) => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    const userEmail = (user.email || '').toLowerCase().trim();
    const authorizedEmail = AUTHORIZED_ADMIN_EMAIL.toLowerCase().trim();

    if (userEmail === authorizedEmail) {
      callback(user);
    } else {
      // Auto sign out invalid user
      await signOut(auth);
      callback(
        null,
        `Access Denied: The account "${user.email}" is not authorized. Access is strictly restricted to the administrator.`
      );
    }
  });
}
