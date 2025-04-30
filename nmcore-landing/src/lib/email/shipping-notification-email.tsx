import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

// Types for shipping notification props
interface OrderItem {
  imageUrl: string;
  title: string;
  size: string;
}

interface ShippingNotificationEmailProps {
  name: string;
  orderId: string;
  trackingUrl: string;
  trackingNumber: string;
  items: OrderItem[];
}

export const ShippingNotificationEmail: React.FC<ShippingNotificationEmailProps> = ({
  name,
  orderId,
  trackingUrl,
  trackingNumber,
  items
}) => {
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';
  const fmt = (text: string) => text;

  return (
    <Html>
      <Head />
      <Preview>Your package is on the way!</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-4">
          <Container className="border border-solid border-[#eaeaea] rounded my-8 mx-auto p-6 max-w-[600px]">
            {/* Logo */}
            <Img
              src={`${frontendUrl}/images/nmcore_logo_onblack.png`}
              alt="NMCore Logo"
              className="mx-auto mb-4"
              width="150"
              height="auto"
            />

            {/* Header */}
            <Text className="text-xl font-bold text-black">Order #{orderId}</Text>
            <Text className="text-[14px] leading-[24px] mt-2">
              Your order is on the way. Track your shipment to see the delivery status.
            </Text>

            <Hr className="my-4" />

            {/* Tracking Info */}
            <Text className="font-semibold text-black">Tracking Number</Text>
            <Link href={trackingUrl} className="underline text-[14px] leading-[24px]">
              {trackingNumber}
            </Link>

            <Hr className="my-4" />

            {/* Items in this shipment */}
            <Text className="font-semibold text-black mb-2">Items in this shipment</Text>
            {items.map((item, idx) => (
              <Section key={idx} className="flex items-center mb-4">
                <Img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <Column className="ml-4">
                  <Text className="text-[14px] font-medium text-black">{item.title}</Text>
                  <Text className="text-[12px] text-gray-600">Size: {item.size}</Text>
                </Column>
              </Section>
            ))}

            <Hr className="my-4" />

            {/* Footer */}
            <Text className="text-[12px] leading-[16px] text-gray-600">
              If you have any questions, please contact us at{' '}
              <Link href="mailto:hello@nmcore.com" className="underline">
                hello@nmcore.com
              </Link>.
            </Text>

            <Text className="text-[12px] leading-[16px] mt-2">Best regards,</Text>
            <Text className="text-[12px] leading-[16px]">Hud and the NMCore Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ShippingNotificationEmail;
