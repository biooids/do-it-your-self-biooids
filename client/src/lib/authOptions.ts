import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { jwtDecode } from "jwt-decode";
import { SystemRole, SanitizedUserDto } from "@/lib/features/user/userTypes";

// Define internal types for clarity
type ApiUser = SanitizedUserDto;

interface BackendAuthResponse {
  status: string;
  message: string;
  data: {
    user: ApiUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
      refreshTokenExpiresAt: string;
    };
  };
}

// --- Helper Functions (Unchanged) ---

const getExpiryFromTokenString = (
  token: string | undefined | null
): number | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    return decoded.exp ? decoded.exp * 1000 : null; // exp is in seconds, convert to ms
  } catch (e) {
    console.error("[NextAuth] ERROR: Failed to decode token for expiry.", e);
    return null;
  }
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("[NextAuth] INFO: Access token expired. Attempting refresh...");
    const backendRefreshUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/refresh`;

    const response = await fetch(backendRefreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.backendRefreshToken }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      console.error(
        "[NextAuth] ERROR: Backend refresh failed.",
        refreshedTokens
      );
      throw refreshedTokens;
    }

    const newTokens = refreshedTokens.data.tokens;
    console.log("[NextAuth] INFO: Token refresh successful.");

    return {
      ...token,
      backendAccessToken: newTokens.accessToken,
      backendAccessTokenExpiresAt:
        getExpiryFromTokenString(newTokens.accessToken) ?? 0,
      backendRefreshToken: newTokens.refreshToken ?? token.backendRefreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error(
      "[NextAuth] CATCH: Unrecoverable error during refresh. User must sign in again.",
      error
    );
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// --- Main NextAuth Configuration ---

export const authOptions: NextAuthOptions = {
  theme: {
    logo: "/logo.png",
    brandColor: "#7c3aed",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        action: { label: "Action", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        name: { label: "Display Name", type: "text" },
      },
      async authorize(credentials) {
        const backendApiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
        if (!backendApiBaseUrl || !credentials) {
          throw new Error("Configuration or credentials missing.");
        }

        const { action, email, password, username, name } = credentials;
        let endpointPath = "";
        let payload = {};

        if (action === "signup") {
          endpointPath = "/auth/register";
          payload = { email, password, username, name };
        } else if (action === "login") {
          endpointPath = "/auth/login";
          payload = { email, password };
        } else {
          throw new Error("Invalid authentication action.");
        }

        const res = await fetch(`${backendApiBaseUrl}${endpointPath}`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        const responseData: BackendAuthResponse = await res.json();

        if (!res.ok || !responseData.data) {
          throw new Error(responseData.message || "Authentication failed.");
        }

        const { user, tokens } = responseData.data;

        if (!user || !tokens) {
          throw new Error("Invalid response from authentication service.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImage,
          systemRole: user.systemRole,
          userRole: user.userRole,
          username: user.username,
          backendAccessToken: tokens.accessToken,
          backendAccessTokenExpiresAt:
            getExpiryFromTokenString(tokens.accessToken) ?? 0,
          backendRefreshToken: tokens.refreshToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account) {
        if (account.provider === "credentials") {
          const credentialUser = user as any;
          return {
            ...token,
            id: credentialUser.id,
            name: credentialUser.name,
            picture: credentialUser.image,
            systemRole: credentialUser.systemRole,
            userRole: credentialUser.userRole,
            username: credentialUser.username,
            backendAccessToken: credentialUser.backendAccessToken,
            backendAccessTokenExpiresAt:
              credentialUser.backendAccessTokenExpiresAt,
            backendRefreshToken: credentialUser.backendRefreshToken,
          };
        } else {
          const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/oauth`;
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile!.email!,
              name: profile!.name,
              image: profile!.image,
            }),
          });

          if (response.ok) {
            const resData: BackendAuthResponse = await response.json();
            const { user: apiUser, tokens } = resData.data;
            if (apiUser && tokens) {
              return {
                ...token,
                id: apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                picture: apiUser.profileImage,
                systemRole: apiUser.systemRole,
                userRole: apiUser.userRole,
                username: apiUser.username,
                backendAccessToken: tokens.accessToken,
                backendAccessTokenExpiresAt:
                  getExpiryFromTokenString(tokens.accessToken) ?? 0,
                backendRefreshToken: tokens.refreshToken,
              };
            }
          }
          return { ...token, error: "OAuthUserProcessingError" };
        }
      }

      if (
        token.backendAccessTokenExpiresAt &&
        Date.now() < token.backendAccessTokenExpiresAt
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.image = token.picture ?? null;
        session.user.systemRole = token.systemRole as SystemRole | null;
        session.user.username = token.username as string | null;
      }
      session.backendAccessToken = token.backendAccessToken as
        | string
        | undefined;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
