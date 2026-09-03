import Papa from 'papaparse';

type CacheEntry = { csv: string; fetchedAt: number };

export type FaqRow = {
  id: string;
  category: string;
  keyword: string;
  answer: string;
  status: string;
};

const READY_STATUS = 'พร้อมใช้';

let cache: CacheEntry | null = null;
let lastGood: CacheEntry | null = null;

const TTL_MS = 60_000;
const MAX_CSV_CHARS = 50_000;
const FETCH_TIMEOUT_MS = 5_000;

function looksLikeHtml(text: string): boolean {
  const trimmed = text.trimStart();
  return trimmed.startsWith('<') || trimmed.toLowerCase().includes('<!doctype');
}

export async function getFaqCsv(): Promise<string | null> {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < TTL_MS) {
    return cache.csv;
  }

  const url = process.env.SHEET_CSV_URL;
  if (!url) {
    console.error('[sheet] SHEET_CSV_URL is not set');
    return lastGood?.csv ?? null;
  }

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(`[sheet] http ${res.status}`);
      return lastGood?.csv ?? null;
    }

    const text = (await res.text()).trim();

    if (!text || looksLikeHtml(text)) {
      console.error('[sheet] invalid csv payload');
      return lastGood?.csv ?? null;
    }

    const csv = text.slice(0, MAX_CSV_CHARS);
    const entry: CacheEntry = { csv, fetchedAt: now };
    cache = entry;
    lastGood = entry;

    console.log('[sheet]', JSON.stringify({ status: 'fetched', chars: csv.length }));

    return csv;
  } catch (err) {
    console.error('[sheet] fetch failed', err instanceof Error ? err.message : err);
    return lastGood?.csv ?? null;
  }
}

type SheetRecord = Record<string, string | undefined>;

export async function getFaqRows(): Promise<FaqRow[] | null> {
  const csv = await getFaqCsv();
  if (!csv) return null;

  const parsed = Papa.parse<SheetRecord>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .map((record): FaqRow => ({
      id: (record['ID'] ?? '').trim(),
      category: (record['หมวดหมู่'] ?? '').trim(),
      keyword: (record['คำถาม/Keyword'] ?? '').trim(),
      answer: (record['คำตอบ'] ?? '').trim(),
      status: (record['สถานะ'] ?? '').trim(),
    }))
    .filter((row) => row.status === READY_STATUS && row.id !== '' && row.answer !== '');
}
