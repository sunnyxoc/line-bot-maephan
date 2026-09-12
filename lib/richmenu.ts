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

function lineOrderButton(): messagingApi.FlexBox {
  return {
    type: 'box',
    layout: 'horizontal',
    cornerRadius: '12px',
    paddingAll: '10px',
    alignItems: 'center',
    backgroundColor: '#C98A3E',
    action: { type: 'message', text: 'สั่งซื้อผ่านไลน์' },
    contents: [
      {
        type: 'box',
        layout: 'vertical',
        flex: 1,
        contents: [
          { type: 'text', text: 'สั่งผ่าน LINE', size: 'sm', weight: 'bold', color: '#1A1A1A' },
          { type: 'text', text: 'คุยกับแอดมิน • แนะนำสินค้าให้ได้', size: 'xxs', color: '#4A3A1A', margin: 'none' },
        ],
      },
      { type: 'text', text: '›', flex: 0, size: 'md', color: '#1A1A1A' },
    ],
  };
}

function marketplaceOrderButton(title: string, uri: string): messagingApi.FlexBox {
  return {
    type: 'box',
    layout: 'horizontal',
    cornerRadius: '12px',
    paddingAll: '10px',
    alignItems: 'center',
    backgroundColor: '#16130F',
    borderColor: '#967E54',
    borderWidth: '1px',
    action: { type: 'uri', uri },
    contents: [
      {
        type: 'box',
        layout: 'vertical',
        flex: 1,
        contents: [
          { type: 'text', text: title, size: 'sm', weight: 'bold', color: '#F5EDE0' },
          { type: 'text', text: 'ร้านค้าทางการ แม่พันธ์', size: 'xxs', color: '#968E82', margin: 'none' },
        ],
      },
      { type: 'text', text: '›', flex: 0, size: 'md', color: '#C9922E' },
    ],
  };
}

const ORDER_FLEX: messagingApi.FlexMessage = {
  type: 'flex',
  altText: 'สั่งซื้อกับแม่พันธ์',
  contents: {
    type: 'bubble',
    hero: {
      type: 'image',
      url: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789186400/maephan-order.png',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#000000',
      paddingTop: '0px',
      paddingStart: '20px',
      paddingEnd: '20px',
      paddingBottom: '20px',
      spacing: 'sm',
      contents: [
        lineOrderButton(),
        marketplaceOrderButton('สั่งผ่าน Shopee', 'https://shopee.co.th/shop/1914406878'),
        marketplaceOrderButton('สั่งผ่าน Lazada', 'https://www.lazada.co.th/shop/mae-phan'),
        marketplaceOrderButton('สั่งผ่าน TikTok Shop', 'https://vt.tiktok.com/ZSqPtM7cB/?page=TikTokShop'),
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#0D0D0D',
      paddingAll: '14px',
      contents: [
        { type: 'separator', color: '#3D3428' },
        { type: 'text', text: 'รสชาติที่ใส่ใจในทุกคำ', size: 'xs', color: '#C9922E', align: 'center', margin: 'md' },
      ],
    },
    styles: {
      hero: { backgroundColor: '#0D0D0D' },
      body: { backgroundColor: '#0D0D0D' },
      footer: { backgroundColor: '#0D0D0D' },
    },
  },
};

export function handleRichMenu(text: string): RichMenuResult | null {
  const trimmed = text.trim();

  switch (trimmed) {
    case 'สั่งซื้อสินค้า':
      return { action: 'reply', keyword: trimmed, messages: [ORDER_FLEX] };

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
