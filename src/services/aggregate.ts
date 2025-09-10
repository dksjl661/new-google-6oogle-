import { searchWikipedia } from '../providers/wiki';
import { searchHackerNews } from '../providers/hn';
import type { SearchResult } from '../types';

export async function aggregateSearch(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const [wiki, hn] = await Promise.all([
    searchWikipedia(query, signal).catch(() => []),
    searchHackerNews(query, signal).catch(() => []),
  ]);
  const combined = [...wiki, ...hn];
  // naive ranking: prioritize exact query matches in title, then length
  const q = query.toLowerCase();
  combined.sort((a, b) => {
    const aExact = a.title.toLowerCase().includes(q) ? 1 : 0;
    const bExact = b.title.toLowerCase().includes(q) ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;
    return a.title.length - b.title.length;
  });
  return combined;
}


