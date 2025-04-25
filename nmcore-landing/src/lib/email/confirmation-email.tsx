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

interface ConfirmationEmailProps {
  name: string;
  orderId: string;
  reviewToken: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = (props) => {
  // Ensure all props are strings
  const name = String(props.name || '');
  const orderId = String(props.orderId || '');
  const reviewToken = String(props.reviewToken || '');
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';
  const reviewLink = `${frontendUrl}/review?token=${reviewToken}`;

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation</Preview>
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
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you {name} for your purchase!
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your order is being processed. Your order ID is <strong>{orderId}</strong>.
            </Text>
            {/* <Text className="text-black text-[14px] leading-[24px]">
              We would love to hear your feedback. Please leave a review by clicking the link below:
            </Text>
            <Link href={reviewLink} className="text-blue-500 underline">Leave a Review</Link> */}
            <Text className="text-black text-[14px] leading-[24px]">
              For inquiries, reach us at{' '}
              <Link href="mailto:hello@nmcore.com">hello@nmcore.com</Link>
            </Text>
            <Text className="text-black text-[12px] leading-[4px] pt-4">Best,</Text>
            <Text className="text-black text-[12px] leading-[4px] ml-1">Hud</Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmationEmail;
