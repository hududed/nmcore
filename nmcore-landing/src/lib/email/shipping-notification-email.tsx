// file: src/lib/email/shipping-notification-email.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface Item {
  imageUrl: string;
  title:    string;
  size:     string;
}

interface ShippingNotificationEmailProps {
  name:           string;
  orderId:        string;
  trackingUrl:    string;
  trackingNumber: string;
  items:          Item[];
}

export const ShippingNotificationEmail: React.FC<ShippingNotificationEmailProps> = ({
  name,
  orderId,
  trackingUrl,
  trackingNumber,
  items,
}) => {
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';

  return (
    <Html>
      <Head>
        <Preview>Your package is on the way!</Preview>
      </Head>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-4 py-6">
          <Container className="border border-solid border-[#eaeaea] rounded-lg mx-auto p-6 max-w-[600px]">

            {/* ← REVERTED: single white-logo only */}
            <div className="text-center mb-8">
              <Img
                src={`${frontendUrl}/images/nmcore_logo_onwhite.png`}
                alt="NMCore Logo"
                className="mx-auto"
                width="150"
                height="auto"
              />
            </div>

            {/* Header */}
            <Text className="text-2xl font-bold mb-2">Order #{orderId}</Text>
            <Text className="text-[15px] leading-[24px] mb-6">
              Your package is on its way! Track its progress below.
            </Text>

            {/* Track Button */}
            <Section className="text-center mb-6">
              <Link
                href={trackingUrl}
                className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium"
              >
                Track with USPS
              </Link>
            </Section>

            {/* Items */}
            <Section className="border-t border-gray-200 pt-6 mb-6">
              <Text className="text-xl font-semibold mb-4">Items in This Shipment</Text>
              {items.map((item, i) => (
                <Section key={i} className="flex items-center mb-4">
                  <Img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4">
                    <Text className="font-medium">{item.title}</Text>
                    <Text className="text-sm text-gray-600">Size: {item.size}</Text>
                  </div>
                </Section>
              ))}
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6 text-center">
              <Text className="text-sm text-gray-600">
                Need help? <Link href="mailto:hello@nmcore.com" className="underline">Contact us</Link>
              </Text>
              <Text className="text-sm mt-2">Cheers, Hud &amp; the NMCore Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ShippingNotificationEmail;
