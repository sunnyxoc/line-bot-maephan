import { messagingApi } from '@line/bot-sdk';

export const RICHMENU_MUTE_MINUTES = 120;

export const CONTACT_ADMIN_REPLY =
  'รับทราบครับ เดี๋ยวแอดมินร้านมาดูแลต่อนะครับ 🙏 หรือโทรหาทางร้านได้ที่ 098-246-8881 ครับ';

export type RichMenuResult =
  | { action: 'reply'; keyword: string; messages: messagingApi.Message[] }
  | {
      action: 'reply_and_mute';
      keyword: string;
      messages: messagingApi.Message[];
      muteMinutes: number;
    };

const ORDER_LEAD_TEXT: messagingApi.TextMessage = {
  type: 'text',
  text: 'เลือกช่องทางที่สะดวกได้เลยครับ',
};

const ORDER_FLEX: messagingApi.FlexMessage = {
  type: 'flex',
  altText: 'สั่งซื้อกับแม่พันธ์',
  contents: {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'สั่งซื้อกับแม่พันธ์', weight: 'bold', size: 'lg' },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: { type: 'message', label: 'สั่งผ่าน LINE', text: 'สั่งซื้อผ่านไลน์' },
        },
        {
          type: 'button',
          style: 'secondary',
          action: { type: 'uri', label: 'Shopee', uri: 'https://shopee.co.th/shop/1914406878' },
        },
        {
          type: 'button',
          style: 'secondary',
          action: { type: 'uri', label: 'Lazada', uri: 'https://www.lazada.co.th/shop/mae-phan' },
        },
        {
          type: 'button',
          style: 'secondary',
          action: {
            type: 'uri',
            label: 'TikTok Shop',
            uri: 'https://vt.tiktok.com/ZSqPtM7cB/?page=TikTokShop',
          },
        },
      ],
    },
  },
};

export function handleRichMenu(text: string): RichMenuResult | null {
  const trimmed = text.trim();

  switch (trimmed) {
    case 'สั่งซื้อสินค้า':
      return { action: 'reply', keyword: trimmed, messages: [ORDER_LEAD_TEXT, ORDER_FLEX] };

    case 'ติดต่อแอดมิน':
      return {
        action: 'reply_and_mute',
        keyword: trimmed,
        muteMinutes: RICHMENU_MUTE_MINUTES,
        messages: [{ type: 'text', text: CONTACT_ADMIN_REPLY }],
      };

    case 'เมนูสินค้า':
    case 'โปรโมชั่น':
    case 'ติดตามพัสดุ':
    case 'คำถามที่พบบ่อย':
      return null;

    default:
      return null;
  }
}
