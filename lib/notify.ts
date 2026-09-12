import { messagingApi } from '@line/bot-sdk';

const MAX_USER_MESSAGE_LENGTH = 100;

const REASON_LABELS = {
  complaint: 'ร้องเรียนสินค้า',
  contact: 'กดปุ่มติดต่อแอดมิน',
} as const;

let client: messagingApi.MessagingApiClient | null = null;

function getClient(): messagingApi.MessagingApiClient {
  if (!client) {
    client = new messagingApi.MessagingApiClient({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    });
  }
  return client;
}

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export async function notifyAdmin(params: {
  userMessage: string;
  reason: 'complaint' | 'contact';
}): Promise<void> {
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!adminUserId) {
    console.log('[notify] no admin id');
    return;
  }

  try {
    const text = [
      '🔔 มีลูกค้าต้องการความช่วยเหลือ',
      '',
      `ข้อความ: "${truncate(params.userMessage, MAX_USER_MESSAGE_LENGTH)}"`,
      `สาเหตุ: ${REASON_LABELS[params.reason]}`,
      '',
      'ชิมิหยุดตอบห้องนี้แล้ว 2 ชั่วโมง',
      'กรุณาเข้าไปตอบใน LINE OA',
    ].join('\n');

    await getClient().pushMessage({
      to: adminUserId,
      messages: [{ type: 'text', text }],
    });

    console.log('[notify]', JSON.stringify({ action: 'sent', reason: params.reason }));
  } catch (err) {
    console.error('[notify] failed', err instanceof Error ? err.message : err);
  }
}
