// src/config/cognito.ts
import { Amplify } from "aws-amplify";
import type { ResourcesConfig } from "aws-amplify";

/**
 * Your pool IDs (User Pool only)
 * Region is inferred by Amplify from the pool id (v6), so we don't set it.
 */
export const COGNITO = {
  userPoolId: "ap-south-1_vO3JrzLxO",
  userPoolClientId: "5malidq05ugr6ktogaju94hs4r",
} as const;

/**
 * Minimal v6 config for email+password auth with NO guest access and NO Identity Pool.
 * We cast the outer object to ResourcesConfig after construction to keep TS happy
 * without importing internal types that differ across minor versions.
 */
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: COGNITO.userPoolId,
      userPoolClientId: COGNITO.userPoolClientId,
      loginWith: { email: true },
      allowGuestAccess: false,
    },
  },
} as const;

// Type-safe cast for the whole Amplify config (prevents the identityPoolId error)
Amplify.configure(amplifyConfig as unknown as ResourcesConfig);

export default COGNITO;
