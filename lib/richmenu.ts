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
    backgroundColor: '#E6C88A',
    action: { type: 'message', text: 'สั่งซื้อผ่านไลน์' },
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
  detailImageUrl: string;
  buyUri: string;
};

const PRODUCTS: Product[] = [
  {
    keyword: 'รายละเอียดปลาสลิด',
    carouselHeroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247264/menu-plasalid.png.png',
    weightLabel: '150 กรัม',
    price: '฿199',
    detailImageUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247424/detail-plasalid.png.png',
    buyUri: 'https://shop.line.me/@067xnyhv/product/1008331248',
  },
  {
    keyword: 'รายละเอียดกุ้งเสียบ',
    carouselHeroUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247262/menu-kungsiab.png.png',
    weightLabel: '150 กรัม',
    price: '฿179',
    detailImageUrl: 'https://res.cloudinary.com/pqc4oisc/image/upload/v1789247425/detail-kungsiab.png.png',
    buyUri: 'https://shop.line.me/@067xnyhv/product/1008331291',
  },
];

function buyButton(uri: string): messagingApi.FlexBox {
  return {
    type: 'box',
    layout: 'vertical',
    backgroundColor: '#E6C88A',
    cornerRadius: '10px',
    paddingAll: '14px',
    alignItems: 'center',
    action: { type: 'uri', uri },
    contents: [
      { type: 'text', text: 'เลือกซื้อ', size: 'lg', weight: 'bold', color: '#100C08', align: 'center' },
    ],
  };
}

function productCarouselBubble(product: Product): messagingApi.FlexBubble {
  return {
    type: 'bubble',
    size: 'mega',
    hero: {
      type: 'image',
      url: product.carouselHeroUrl,
      aspectRatio: '1040:845',
      aspectMode: 'cover',
      size: 'full',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      backgroundColor: '#000000',
      paddingAll: '16px',
      spacing: 'sm',
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
              paddingAll: '12px',
              alignItems: 'center',
              contents: [
                { type: 'text', text: product.weightLabel, size: 'xs', color: '#9E968A', align: 'center' },
                { type: 'text', text: product.price, size: 'xl', weight: 'bold', color: '#E6C88A', align: 'center' },
              ],
            },
            {
              type: 'box',
              layout: 'vertical',
              flex: 1,
              backgroundColor: '#16130F',
              cornerRadius: '10px',
              paddingAll: '12px',
              borderColor: '#CDAF76',
              borderWidth: '2px',
              alignItems: 'center',
              justifyContent: 'center',
              action: { type: 'message', text: product.keyword },
              contents: [
                { type: 'text', text: 'รายละเอียด', size: 'md', weight: 'bold', color: '#FFFFFF', align: 'center' },
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

function productDetailMessages(product: Product): messagingApi.Message[] {
  return [
    {
      type: 'image',
      originalContentUrl: product.detailImageUrl,
      previewImageUrl: product.detailImageUrl,
    },
    {
      type: 'flex',
      altText: 'รายละเอียดสินค้า',
      contents: {
        type: 'bubble',
        size: 'mega',
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#000000',
          paddingAll: '16px',
          spacing: 'sm',
          contents: [
            buyButton(product.buyUri),
            {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#16130F',
              cornerRadius: '10px',
              paddingAll: '14px',
              borderColor: '#CDAF76',
              borderWidth: '2px',
              alignItems: 'center',
              action: { type: 'uri', uri: 'https://liff.line.me/1572442362-jGxDDGRp/@067xnyhv' },
              contents: [
                { type: 'text', text: 'ดูสินค้าอื่น', size: 'md', weight: 'bold', color: '#FFFFFF', align: 'center' },
              ],
            },
            {
              type: 'text',
              text: 'ระดับความเผ็ดเป็นการประเมินของทางร้าน อาจต่างกันในแต่ละคน',
              size: 'xxs',
              color: '#78716A',
              align: 'center',
              margin: 'md',
              wrap: true,
            },
          ],
        },
      },
    },
  ];
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
