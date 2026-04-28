import { jwtVerify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

interface PrivyClaims {
  sub: string;
  sid: string;
  aud: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

export async function verifyPrivyToken(authHeader: string | null): Promise<PrivyClaims> {
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const privyAppSecret = Deno.env.get('PRIVY_APP_SECRET');

  if (!privyAppSecret) {
    throw new Error('PRIVY_APP_SECRET not configured');
  }

  try {
    const payload = await jwtVerify(
      token,
      new TextEncoder().encode(privyAppSecret)
    );

    return payload as PrivyClaims;
  } catch (err) {
    throw new Error(`Invalid Privy token: ${err.message}`);
  }
}
