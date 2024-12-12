// functions/src/email/confirmation-email.tsx
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Text
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ConfirmationEmailProps {
  name: string;
  orderId: string;
}

export const ConfirmationEmail = ({ name, orderId }: ConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Text className="text-black text-[14px] leading-[24px]">Thank you {name} for your purchase!</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Your order is being processed. Your order ID is {orderId}.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              For inquiries, reach us at{' '}
              <Link href="mailto:hud@nmcore.com">hud@nmcore.com</Link>
            </Text>
            <Text className="text-black text-[12px] leading-[4px] pt-4">Best,</Text>
            <Text className="text-black text-[12px] leading-[4px] ml-1">Hud</Text>
            <Text className="text-black text-[12px] leading-[4px] ml-1 italic">
              NMCore Team
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmationEmail;