// src/services/auth.ts
import {
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
  type SignInOutput,
} from "aws-amplify/auth";

// Sign up with email + password
export async function signUpEmailPassword(email: string, password: string) {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: { email },
      // autoSignIn: { enabled: false } // optional
    },
  });
}

// Optional helpers you’ll likely call from UI
export async function confirmEmail(email: string, code: string) {
  return confirmSignUp({ username: email, confirmationCode: code });
}
export async function resendCode(email: string) {
  return resendSignUpCode({ username: email });
}
export async function login(email: string, password: string): Promise<SignInOutput> {
  return signIn({ username: email, password });
}
export async function logout() {
  await signOut();
}
export async function getJwt(): Promise<string | null> {
  const { tokens } = await fetchAuthSession();
  // prefer idToken for your API, or accessToken if you validate that one
  return tokens?.idToken?.toString() ?? tokens?.accessToken?.toString() ?? null;
}
