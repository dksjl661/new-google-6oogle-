import type { SearchResult } from '../types';

export async function searchHackerNews(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    query,
    tags: 'story',
    hitsPerPage: '10',
  });
  const url = `https://hn.algolia.com/api/v1/search?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HN error ${res.status}`);
  const data = await res.json();
  const results: SearchResult[] = (data?.hits ?? [])
    .filter((h: any) => h.title && h.url)
    .map((h: any) => ({
      id: `hn:${h.objectID}`,
      title: h.title,
      url: h.url,
      snippet: h._highlightResult?.title?.value?.replace(/<[^>]+>/g, '') || '',
      source: 'hn',
    }));
  return results;
}


