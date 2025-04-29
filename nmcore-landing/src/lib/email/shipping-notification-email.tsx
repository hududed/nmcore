import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ShippingNotificationEmailProps {
  name: string;
  orderId: string;
  serviceName: string;
  shipDate: string;
  trackingUrl: string;
  trackingNumber: string;
}

export const ShippingNotificationEmail: React.FC<ShippingNotificationEmailProps> = ({
  name,
  orderId,
  serviceName,
  shipDate,
  trackingUrl,
  trackingNumber
}) => {
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';
  const formattedDate = new Date(shipDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Html>
      <Head />
      <Preview>Shipping Notification</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Img
              src={`${frontendUrl}/images/nmcore_logo_onblack.png`}
              alt="NMCore Logo"
              className="mx-auto mb-4"
              width="150"
              height="auto"
            />
            <Text className="text-black text-[14px] leading-[24px]">Hello {name},</Text>
            <Text className="text-black text-[14px] leading-[24px] mt-4">
              Your order <strong>{orderId}</strong> shipped via <strong>{serviceName}</strong> on {formattedDate}.
            </Text>
            <Text className="text-black text-[14px] leading-[24px] mt-2">
              Tracking Number:{' '}
              <Link href={trackingUrl} className="underline">
                {trackingNumber}
              </Link>
            </Text>
            <Text className="text-black text-[12px] leading-[16px] italic mt-1">
              Click the tracking number above to see your shipment status.
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-black text-[12px] leading-[16px]">
              If you have any questions, reply to this email or reach us at{' '}
              <Link href="mailto:hello@nmcore.com" className="underline">
                hello@nmcore.com
              </Link>.
            </Text>
            <Text className="text-black text-[12px] leading-[16px] mt-2">Best,</Text>
            <Text className="text-black text-[12px] leading-[16px] ml-2">Hud</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ShippingNotificationEmail;
