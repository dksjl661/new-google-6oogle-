export type SearchSource = 'wikipedia' | 'hn';

export type SearchResult = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: SearchSource;
};


