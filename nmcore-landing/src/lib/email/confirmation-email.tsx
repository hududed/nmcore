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

// …imports and types above remain unchanged…

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
  shippingMethod,
}) => {
  const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://www.nmcore.com';
  const fmt = (cents: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <Html>
      <Head>
        <Preview>Order Confirmation</Preview>
      </Head>
      <Tailwind>
        <Body className="bg-white mx-auto font-sans px-4 py-6">
          <Container className="border border-solid border-[#eaeaea] rounded-lg mx-auto p-6 max-w-[600px]">
            
            {/* ← REVERTED: single white-logo only */}
            <div className="text-center mb-6">
              <Img
                src={`${frontendUrl}/images/nmcore_logo_onwhite.png`}
                alt="NMCore Logo"
                className="mx-auto"
                width="150"
                height="auto"
              />
            </div>

            {/* Header */}
            <Text className="text-2xl font-bold text-black mb-1">Order #{orderId}</Text>
            <Text className="text-[14px] leading-[24px] mb-4">
              Thank you for your purchase, {name}!
            </Text>
            <Text className="text-[14px] leading-[24px] mb-6">
              We're getting your order ready to be shipped. We will notify you when it has been sent.
            </Text>

            {items.length > 0 && (
              <>
                <Section className="border-t border-gray-200 pt-4 mb-4">
                  <Text className="text-xl font-semibold text-black mb-4">Order Summary</Text>

                  {items.map((item, i) => (
                    <Section key={i} className="flex items-center mb-4">
                      <Img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <Text className="text-black text-[15px] font-medium">
                          {item.title}
                        </Text>
                        <Text className="text-[13px] text-gray-600">
                          {item.code} × {item.quantity}
                        </Text>
                      </div>
                      <Text className="text-[15px] font-medium text-black">
                        {fmt(item.price * item.quantity)}
                      </Text>
                    </Section>
                  ))}

                  <Section className="mt-2">
                    <div className="flex justify-between mb-2">
                      <Text className="text-[14px]">Subtotal:</Text>
                      <Text className="text-[14px]">{fmt(subtotal)}</Text>
                    </div>
                    {discount! > 0 && (
                      <div className="flex justify-between mb-2">
                        <Text className="text-[14px]">Discount:</Text>
                        <Text className="text-[14px] text-green-600">-{fmt(discount!)}</Text>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <Text className="text-[14px]">Shipping:</Text>
                      <Text className="text-[14px]">{fmt(shippingCost)}</Text>
                    </div>
                    <div className="flex justify-between mb-2">
                      <Text className="text-[14px]">Taxes:</Text>
                      <Text className="text-[14px]">{fmt(taxes)}</Text>
                    </div>
                    <Section className="border-t border-gray-200 mt-3 pt-3">
                      <div className="flex justify-between">
                        <Text className="text-[16px] font-bold">Total:</Text>
                        <Text className="text-[16px] font-bold">{fmt(total)}</Text>
                      </div>
                    </Section>
                  </Section>
                </Section>

                {(shippingAddress && billingAddress) && (
                  <Section className="border-t border-gray-200 pt-4 mb-4">
                    <Text className="text-xl font-semibold text-black mb-4">Customer Information</Text>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text className="font-medium mb-1">Shipping Address</Text>
                        <Text>{shippingAddress.name}</Text>
                        <Text>{shippingAddress.line1}</Text>
                        {shippingAddress.line2 && <Text>{shippingAddress.line2}</Text>}
                        <Text>
                          {shippingAddress.city}, {shippingAddress.state}{' '}
                          {shippingAddress.postalCode}
                        </Text>
                        <Text>{shippingAddress.country}</Text>
                      </div>
                      <div>
                        <Text className="font-medium mb-1">Billing Address</Text>
                        <Text>{billingAddress.name}</Text>
                        <Text>{billingAddress.line1}</Text>
                        {billingAddress.line2 && <Text>{billingAddress.line2}</Text>}
                        <Text>
                          {billingAddress.city}, {billingAddress.state}{' '}
                          {billingAddress.postalCode}
                        </Text>
                        <Text>{billingAddress.country}</Text>
                      </div>
                    </div>
                  </Section>
                )}

                {shippingMethod && (
                  <Section className="border-t border-gray-200 pt-4 mb-4">
                    <Text className="font-medium">Shipping Method</Text>
                    <Text>{shippingMethod}</Text>
                  </Section>
                )}
              </>
            )}

            <Section className="border-t border-gray-200 pt-4">
              <Text className="text-[12px] leading-[16px] text-gray-600">
                For inquiries, reach us at{' '}
                <Link href="mailto:hello@nmcore.com" className="underline">
                  hello@nmcore.com
                </Link>
              </Text>
              <Text className="text-[12px] leading-[16px] mt-2">Best,</Text>
              <Text className="text-[12px] leading-[16px]">Hud</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmationEmail;
