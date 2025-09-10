import type { SearchResult } from '../types';

export async function searchWikipedia(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
    origin: '*',
    srlimit: '10',
  });
  const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Wikipedia error ${res.status}`);
  const data = await res.json();
  const results: SearchResult[] = (data?.query?.search ?? []).map((item: any) => ({
    id: `wikipedia:${item.pageid}`,
    title: item.title,
    url: `https://en.wikipedia.org/?curid=${item.pageid}`,
    snippet: stripHtml(item.snippet),
    source: 'wikipedia',
  }));
  return results;
}

function stripHtml(html: string): string {
  const tmp = html.replace(/<[^>]+>/g, '');
  return tmp.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}


