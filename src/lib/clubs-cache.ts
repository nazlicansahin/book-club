const TTL_MS = 30_000;

type CacheEntry = {
  clubs: import("./clubs").Club[];
  fetchedAt: number;
};

let cache: { uid: string; entry: CacheEntry } | null = null;

export function invalidateClubsCache() {
  cache = null;
}

export async function getUserClubsCached(
  uid: string,
  fetcher: () => Promise<import("./clubs").Club[]>,
  options?: { force?: boolean }
) {
  const now = Date.now();
  if (
    !options?.force &&
    cache &&
    cache.uid === uid &&
    now - cache.entry.fetchedAt < TTL_MS
  ) {
    return cache.entry.clubs;
  }

  const clubs = await fetcher();
  cache = { uid, entry: { clubs, fetchedAt: now } };
  return clubs;
}
