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

// Types
export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  imageUrl: string;
  title: string;
  code: string;
  price: number; // in cents
  quantity: number;
}

// ConfirmationEmailProps: only name & orderId required, others optional
export interface ConfirmationEmailProps {
  name: string;
  orderId: string;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  taxes?: number;
  total?: number;
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethod?: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  name,
  orderId,
  items = [],
  subtotal = 0,
  discount = 0,
  shippingCost = 0,
  taxes = 0,
  total = 0,
  shippingAddress,
  billingAddress,
  shippingMethod
}) => {
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';
  const fmt = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation</Preview>
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
              Thank you for your purchase, {name}!
            </Text>
            <Text className="text-[14px] leading-[24px] mt-1">
              We're getting your order ready to be shipped. We will notify you when it has been sent.
            </Text>

            {/* Detailed summary if items provided */}
            {items.length > 0 && (
              <>
                <Hr className="my-4" />
                <Text className="text-lg font-semibold text-black mb-2">Order Summary</Text>
                {items.map((item, i) => (
                  <Section key={i} className="flex items-center mb-4">
                    <Img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Column className="ml-4 flex-1">
                      <Text className="text-black text-[14px] leading-[20px] font-medium">
                        {item.title}
                      </Text>
                      <Text className="text-[12px] text-gray-600">
                        {item.code} × {item.quantity}
                      </Text>
                    </Column>
                    <Text className="text-[14px] font-medium text-black">
                      {fmt(item.price * item.quantity)}
                    </Text>
                  </Section>
                ))}
                <Section className="mt-2">
                  <Column className="flex justify-between">
                    <Text>Subtotal:</Text>
                    <Text>{fmt(subtotal)}</Text>
                  </Column>
                  {discount > 0 && (
                    <Column className="flex justify-between">
                      <Text>Discount:</Text>
                      <Text>-{fmt(discount)}</Text>
                    </Column>
                  )}
                  <Column className="flex justify-between">
                    <Text>Shipping:</Text>
                    <Text>{fmt(shippingCost)}</Text>
                  </Column>
                  <Column className="flex justify-between">
                    <Text>Taxes:</Text>
                    <Text>{fmt(taxes)}</Text>
                  </Column>
                  <Hr className="my-2" />
                  <Column className="flex justify-between">
                    <Text className="font-bold">Total:</Text>
                    <Text className="font-bold">{fmt(total)}</Text>
                  </Column>
                </Section>
              </>
            )}

            {/* Customer & shipping details if provided */}
            {(shippingAddress && billingAddress) && (
              <>
                <Hr className="my-4" />
                <Text className="text-lg font-semibold text-black mb-2">Customer Information</Text>
                <Section className="flex mb-4">
                  <Column className="flex-1">
                    <Text className="font-medium">Shipping Address</Text>
                    <Text>{shippingAddress.name}</Text>
                    <Text>{shippingAddress.line1}</Text>
                    {shippingAddress.line2 && <Text>{shippingAddress.line2}</Text>}
                    <Text>
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                    </Text>
                    <Text>{shippingAddress.country}</Text>
                  </Column>
                  <Column className="flex-1">
                    <Text className="font-medium">Billing Address</Text>
                    <Text>{billingAddress.name}</Text>
                    <Text>{billingAddress.line1}</Text>
                    {billingAddress.line2 && <Text>{billingAddress.line2}</Text>}
                    <Text>
                      {billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}
                    </Text>
                    <Text>{billingAddress.country}</Text>
                  </Column>
                </Section>
              </>
            )}

            {shippingMethod && (
              <>
                <Hr className="my-4" />
                <Text className="font-medium">Shipping Method</Text>
                <Text className="mb-4">{shippingMethod}</Text>
              </>
            )}

            <Hr className="my-4" />
            <Text className="text-[12px] leading-[16px] text-gray-600">
              For inquiries, reach us at{' '}
              <Link href="mailto:hello@nmcore.com" className="underline">
                hello@nmcore.com
              </Link>
            </Text>
            <Text className="text-[12px] leading-[16px] mt-2">Best regards,</Text>
            <Text className="text-[12px] leading-[16px]">Hud and the NMCore Team</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmationEmail;
