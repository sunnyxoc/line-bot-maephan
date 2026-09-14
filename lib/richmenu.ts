import { messagingApi } from '@line/bot-sdk';
import { CONTACT_ADMIN_REPLY } from './gemini';

export const RICHMENU_MUTE_MINUTES = 120;

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
    backgroundColor: '#E6C88A',
    action: { type: 'uri', uri: 'https://liff.line.me/1572442362-jGxDDGRp/@067xnyhv' },
    contents: [
      {
        type: 'box',
        layout: 'vertical',
        flex: 1,
        contents: [
          { type: 'text', text: 'สั่งผ่าน LINE', size: 'sm', weight: 'bold', color: '#100C08' },
          { type: 'text', text: 'คุยกับแอดมิน • แนะนำสินค้าให้ได้', size: 'xxs', color: '#6B5636', margin: 'none' },
        ],
      },
      { type: 'text', text: '›', flex: 0, size: 'md', color: '#1E160A' },
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
    borderColor: '#CDAF76',
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
        { type: 'text', text: 'รสชาติที่ใส่ใจในทุกคำ', size: 'xs', color: '#EBB863', align: 'center', margin: 'md' },
      ],
    },
    styles: {
      hero: { backgroundColor: '#0D0D0D' },
      body: { backgroundColor: '#0D0D0D' },
      footer: { backgroundColor: '#0D0D0D' },
    },
  },
};

type Product = {
  keyword: string;
  carouselHeroUrl: string;
  weightLabel: string;
  price: string;
  detailImages: string[];
  buyUri: string;
};

const PRODUCTS: Product[] = [
  {
    keyword: 'รายละเอียดปลาสลิด',
    carouselHeroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247264/menu-plasalid.png.png',
    weightLabel: '150 กรัม',
    price: '฿199',
    detailImages: ['https://res.cloudinary.com/pqc4oisc/image/upload/v1789249530/detail-plasalidV2.png.png'],
    buyUri: 'https://shop.line.me/@067xnyhv/product/1008331248',
  },
  {
    keyword: 'รายละเอียดกุ้งเสียบ',
    carouselHeroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247262/menu-kungsiab.png.png',
    weightLabel: '150 กรัม',
    price: '฿179',
    detailImages: ['https://res.cloudinary.com/pqc4oisc/image/upload/v1789249530/detail-kungsiabV2.png.png'],
    buyUri: 'https://shop.line.me/@067xnyhv/product/1008331291',
  },
  {
    keyword: 'รายละเอียดเซ็ตลิ้มลอง',
    carouselHeroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789377350/menu-set349.png',
    weightLabel: '150 กรัม × 2',
    price: '฿349',
    detailImages: [
      'https://res.cloudinary.com/pqc4oisc/image/upload/v1789390239/detail-set349-1.png',
      'https://res.cloudinary.com/pqc4oisc/image/upload/v1789390238/detail-set349-2.png',
    ],
    buyUri: 'https://shop.line.me/@067xnyhv/product/1008335668',
  },
];

function actionButton(label: string, action: messagingApi.Action): messagingApi.FlexBox {
  return {
    type: 'box',
    layout: 'vertical',
    backgroundColor: '#E6C88A',
    cornerRadius: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    alignItems: 'center',
    action,
    contents: [
      { type: 'text', text: label, size: 'md', weight: 'bold', color: '#100C08', align: 'center' },
    ],
  };
}

function buyButton(uri: string): messagingApi.FlexBox {
  return actionButton('เลือกซื้อ', { type: 'uri', uri });
}

function productCarouselBubble(product: Product): messagingApi.FlexBubble {
  return {
    type: 'bubble',
    size: 'mega',
    hero: {
      type: 'image',
      url: product.carouselHeroUrl,
      aspectRatio: '2080:1690',
      aspectMode: 'cover',
      size: 'full',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#000000',
      paddingAll: '16px',
      paddingStart: '16px',
      paddingEnd: '16px',
      spacing: 'xs',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          spacing: '12px',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              flex: 1,
              backgroundColor: '#121210',
              cornerRadius: '10px',
              paddingTop: '8px',
              paddingBottom: '8px',
              alignItems: 'center',
              contents: [
                { type: 'text', text: product.weightLabel, size: 'xs', color: '#9E968A', align: 'center' },
                { type: 'text', text: product.price, size: 'lg', weight: 'bold', color: '#E6C88A', align: 'center' },
              ],
            },
            {
              type: 'box',
              layout: 'vertical',
              flex: 1,
              backgroundColor: '#16130F',
              cornerRadius: '10px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderColor: '#CDAF76',
              borderWidth: '2px',
              alignItems: 'center',
              justifyContent: 'center',
              action: { type: 'message', text: product.keyword },
              contents: [
                { type: 'text', text: 'รายละเอียด', size: 'sm', weight: 'bold', color: '#FFFFFF', align: 'center' },
              ],
            },
          ],
        },
        buyButton(product.buyUri),
      ],
    },
  };
}

const MENU_CAROUSEL: messagingApi.FlexMessage = {
  type: 'flex',
  altText: 'เมนูสินค้าแม่พันธ์',
  contents: {
    type: 'carousel',
    contents: PRODUCTS.map(productCarouselBubble),
  },
};

type PromoBubble = {
  heroUrl: string;
  action: messagingApi.Action;
};

const PROMO_BUBBLES: PromoBubble[] = [
  {
    heroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789377325/maephan-promo-newcustomer-light_2.png',
    action: { type: 'message', text: 'สั่งซื้อสินค้า' },
  },
  {
    heroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789377325/maephan-MPFM01-light_2.png',
    action: { type: 'uri', uri: 'https://liff.line.me/1572442362-jGxDDGRp/@067xnyhv' },
  },
  {
    heroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789356986/maephan-FREE349-light.png',
    action: { type: 'uri', uri: 'https://liff.line.me/1572442362-jGxDDGRp/@067xnyhv' },
  },
];

function promoCarouselBubble({ heroUrl, action }: PromoBubble): messagingApi.FlexBubble {
  return {
    type: 'bubble',
    size: 'mega',
    hero: {
      type: 'image',
      url: heroUrl,
      aspectRatio: '2080:1690',
      aspectMode: 'cover',
      size: 'full',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#000000',
      paddingAll: '16px',
      contents: [actionButton('สั่งซื้อเลย', action)],
    },
  };
}

const PROMO_CAROUSEL: messagingApi.FlexMessage = {
  type: 'flex',
  altText: 'โปรโมชั่นแม่พันธ์',
  contents: {
    type: 'carousel',
    contents: PROMO_BUBBLES.map(promoCarouselBubble),
  },
};

function detailBodyContents(buyUri: string): messagingApi.FlexComponent[] {
  return [
    buyButton(buyUri),
    {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#16130F',
      cornerRadius: '10px',
      paddingTop: '10px',
      paddingBottom: '10px',
      borderColor: '#CDAF76',
      borderWidth: '2px',
      alignItems: 'center',
      action: { type: 'uri', uri: 'https://liff.line.me/1572442362-jGxDDGRp/@067xnyhv' },
      contents: [
        { type: 'text', text: 'ดูสินค้าอื่น', size: 'sm', weight: 'bold', color: '#FFFFFF', align: 'center' },
      ],
    },
    {
      type: 'text',
      text: 'ระดับความเผ็ดเป็นการประเมินของทางร้าน',
      size: 'xxs',
      color: '#78716A',
      align: 'center',
      margin: 'md',
    },
    {
      type: 'text',
      text: 'อาจต่างกันในแต่ละคน',
      size: 'xxs',
      color: '#78716A',
      align: 'center',
    },
  ];
}

function detailBubbleMessage(buyUri: string, heroUrl?: string): messagingApi.FlexMessage {
  return {
    type: 'flex',
    altText: 'รายละเอียดสินค้า',
    contents: {
      type: 'bubble',
      size: 'mega',
      ...(heroUrl && {
        hero: {
          type: 'image',
          url: heroUrl,
          aspectRatio: '1040:1450',
          aspectMode: 'cover',
          size: 'full',
        },
      }),
      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#000000',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingStart: '16px',
        paddingEnd: '16px',
        spacing: 'xs',
        contents: detailBodyContents(buyUri),
      },
      styles: {
        ...(heroUrl && { hero: { backgroundColor: '#000000' } }),
        body: { backgroundColor: '#000000' },
      },
    },
  };
}

function productDetailMessages(product: Product): messagingApi.Message[] {
  if (product.detailImages.length === 1) {
    return [detailBubbleMessage(product.buyUri, product.detailImages[0])];
  }

  const imageMessages: messagingApi.ImageMessage[] = product.detailImages.map((url) => ({
    type: 'image',
    originalContentUrl: url,
    previewImageUrl: url,
  }));

  return [...imageMessages, detailBubbleMessage(product.buyUri)];
}

export function handleRichMenu(text: string): RichMenuResult | null {
  const trimmed = text.trim();

  switch (trimmed) {
    case 'สั่งซื้อสินค้า':
      return { action: 'reply', keyword: trimmed, messages: [ORDER_FLEX] };

    case 'เมนูสินค้า':
      return { action: 'reply', keyword: trimmed, messages: [MENU_CAROUSEL] };

    case 'ติดต่อแอดมิน':
      return {
        action: 'reply_and_mute',
        keyword: trimmed,
        muteMinutes: RICHMENU_MUTE_MINUTES,
        messages: [{ type: 'text', text: CONTACT_ADMIN_REPLY }],
      };

    case 'โปรโมชั่น':
      return { action: 'reply', keyword: trimmed, messages: [PROMO_CAROUSEL] };

    case 'ติดตามพัสดุ':
    case 'คำถามที่พบบ่อย':
      return null;

    default: {
      const product = PRODUCTS.find((item) => item.keyword === trimmed);
      if (!product) return null;
      return { action: 'reply', keyword: trimmed, messages: productDetailMessages(product) };
    }
  }
}
