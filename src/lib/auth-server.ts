export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export async function verifyFirebaseToken(idToken: string): Promise<AuthUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{
      localId: string;
      email?: string;
      displayName?: string;
      photoUrl?: string;
    }>;
  };

  const user = data.users?.[0];
  if (!user) return null;

  return {
    uid: user.localId,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoUrl ?? null,
  };
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const header = request.headers.get("Authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = await verifyFirebaseToken(header.slice(7));
  if (!user) {
    throw new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  return user;
}
