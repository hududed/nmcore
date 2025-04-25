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

export const InviteCollaboration = ({ fullName }) => {
  return (
      <Html>
        <Head />
        <style>
        {`
        @font-face {
            font-family: 'DIN2014';
            src: url(data:font/opentype;base64,/* base64 encoded DIN2014_Regular.otf */) format('opentype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'DIN2014';
            src: url(data:font/opentype;base64,/* base64 encoded DIN2014_Bold.otf */) format('opentype');
            font-weight: bold;
            font-style: normal;
        }
        body {
            font-family: 'DIN2014', sans-serif;
        }
        .font-din2014 {
            font-family: 'DIN2014', sans-serif;
        }
        .font-din2014-bold {
            font-family: 'DIN2014', sans-serif;
            font-weight: bold;
        }
        `}
        </style>
        <Preview>Welcome to nmcore!</Preview>
        <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans px-2">
                <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                    {/* <Section className="mt-[32px]">
                        <Img
                            src="https://your-logo-url.com/logo.png" // Replace with your actual logo URL
                            alt="NMCore"
                            width="300"
                            height="102"
                            className="my-0 mx-auto"
                        />
                    </Section> */}
                    <Text className="text-black text-[14px] leading-[24px]">Hello {fullName},</Text>
                    <Text className="text-black text-[14px] leading-[24px]">
                    Welcome to nmcore! We're thrilled to have you join our community of innovative farmers and crop owners.
                    </Text>
                    <Text className="text-black text-[14px] leading-[24px]">
                    Stay tuned for updates on our latest advancements in nanotechnology solutions to enhance plant growth and optimize fertilizer usage.
                    </Text>

                    <Text className="text-black text-[14px] leading-[24px]">
                    For inquiries, reach us at{' '}
                    <Link href="mailto:hello@nmcore.com">hello@nmcore.com</Link>
                    </Text>

                    <Text className="text-black text-[12px] leading-[4px] pt-4">Best,</Text>
                    <Text className="text-black text-[12px] leading-[4px] ml-1">Hud</Text>
                    <Text className="text-black text-[12px] leading-[4px] ml-1">
                        nmcore Team
                    </Text>
                    <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                </Container>
            </Body>
        </Tailwind>
      </Html>
  );
};

export default InviteCollaboration;