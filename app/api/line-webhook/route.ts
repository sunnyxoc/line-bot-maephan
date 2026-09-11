import { validateSignature, messagingApi, type WebhookEvent } from '@line/bot-sdk';
import { waitUntil } from '@vercel/functions';
import { getFaqRows } from '@/lib/sheet';
import {
  askChimi,
  DEFAULT_REPLY,
  GREETING_REPLY,
  HANDOVER_REPLY,
  MUTE_MINUTES,
  MUTE_ON_KEYWORDS,
  UNMUTE_ON_KEYWORDS,
  COMPLAINT_KEYWORDS,
} from '@/lib/gemini';
import { isMuted, mute, unmute } from '@/lib/mute';
import { handleRichMenu } from '@/lib/richmenu';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
});

const MAX_SEEN_RETRY_KEYS = 100;
const seenRetryKeys = new Set<string>();

function rememberRetryKey(key: string) {
  seenRetryKeys.add(key);
  if (seenRetryKeys.size > MAX_SEEN_RETRY_KEYS) {
    const oldest = seenRetryKeys.values().next().value;
    if (oldest !== undefined) seenRetryKeys.delete(oldest);
  }
}

async function replyMessages(replyToken: string, messages: messagingApi.Message[]) {
  try {
    await client.replyMessage({ replyToken, messages });
  } catch (err) {
    const status = (err as { status?: number; statusCode?: number })?.status
      ?? (err as { statusCode?: number })?.statusCode;
    const message = err instanceof Error ? err.message : String(err);

    if (status === 401) {
      console.error('[line] AUTH FAILED', message);
    } else if (status === 400) {
      console.error('[line] reply rejected (expired/used token)', message);
    } else if (status === 429) {
      console.error('[line] rate limited', message);
    } else {
      console.error('[line] reply failed, retrying once', message);
      try {
        await client.replyMessage({ replyToken, messages });
      } catch (retryErr) {
        console.error('[line] retry failed', retryErr instanceof Error ? retryErr.message : retryErr);
      }
    }
  }
}

async function reply(replyToken: string, text: string) {
  await replyMessages(replyToken, [{ type: 'text', text }]);
}

function getConversationId(event: WebhookEvent): string | null {
  const source = event.source;
  if (source.type === 'group') return source.groupId;
  if (source.type === 'room') return source.roomId;
  if (source.type === 'user') return source.userId ?? null;
  return null;
}

async function handleEvent(event: WebhookEvent) {
  if (event.type !== 'message') return;

  const replyToken = event.replyToken;
  const conversationId = getConversationId(event);

  if (event.message.type === 'text') {
    const text = event.message.text;

    if (UNMUTE_ON_KEYWORDS.some((keyword) => text.includes(keyword))) {
      if (conversationId) await unmute(conversationId);
      console.log('[mute]', JSON.stringify({ action: 'unmute', conversationId, reason: 'keyword' }));
      await reply(replyToken, 'เปิดชิมิแล้วครับ');
      return;
    }

    if (MUTE_ON_KEYWORDS.some((keyword) => text.includes(keyword))) {
      if (conversationId) await mute(conversationId, MUTE_MINUTES);
      console.log('[mute]', JSON.stringify({ action: 'mute', conversationId, reason: 'keyword' }));
      await reply(replyToken, 'รับทราบครับ ชิมิจะหยุดตอบห้องนี้ 2 ชั่วโมง');
      return;
    }
  }

  if (conversationId && (await isMuted(conversationId))) {
    console.log('[mute]', JSON.stringify({ action: 'skipped', conversationId, reason: 'muted' }));
    return;
  }

  if (event.message.type === 'text') {
    const text = event.message.text;
    const richMenuResult = handleRichMenu(text);

    if (richMenuResult) {
      console.log('[richmenu]', JSON.stringify({ keyword: richMenuResult.keyword }));
      await replyMessages(replyToken, richMenuResult.messages);
      if (richMenuResult.action === 'reply_and_mute' && conversationId) {
        await mute(conversationId, richMenuResult.muteMinutes);
      }
      return;
    }
  }

  if (event.message.type === 'text') {
    const text = event.message.text;
    const matchedKeyword = COMPLAINT_KEYWORDS.find((keyword) => text.includes(keyword));

    if (matchedKeyword) {
      await reply(replyToken, HANDOVER_REPLY);
      if (conversationId) await mute(conversationId, MUTE_MINUTES);
      console.log('[mute]', JSON.stringify({
        action: 'mute',
        conversationId,
        reason: 'complaint detected',
        keyword: matchedKeyword,
      }));
      return;
    }
  }

  if (event.message.type === 'sticker') {
    console.log('[line]', JSON.stringify({ type: 'sticker' }));
    await reply(replyToken, GREETING_REPLY);
    return;
  }

  if (event.message.type !== 'text') {
    console.log('[line]', JSON.stringify({ type: event.message.type }));
    await reply(replyToken, DEFAULT_REPLY);
    return;
  }

  const userMessage = event.message.text;
  console.log('[line]', JSON.stringify({ type: 'text', length: userMessage.length }));

  const rows = await getFaqRows();
  if (!rows || rows.length === 0) {
    await reply(replyToken, DEFAULT_REPLY);
    return;
  }

  const answer = await askChimi(userMessage, rows);
  await reply(replyToken, answer);
}

export async function POST(req: Request) {
  const raw = await req.text();

  const signature = req.headers.get('x-line-signature') ?? '';
  const channelSecret = process.env.LINE_CHANNEL_SECRET!;

  if (!validateSignature(raw, channelSecret, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const retryKey = req.headers.get('x-line-retry-key');
  if (retryKey) {
    if (seenRetryKeys.has(retryKey)) {
      return new Response('OK', { status: 200 });
    }
    rememberRetryKey(retryKey);
  }

  const body = JSON.parse(raw) as { events?: WebhookEvent[] };

  if (!body.events?.length) {
    return new Response('OK', { status: 200 });
  }

  waitUntil(Promise.all(body.events.map((event) => handleEvent(event))).catch((err) => {
    console.error('[line] unhandled event error', err instanceof Error ? err.message : err);
  }));

  return new Response('OK', { status: 200 });
}
