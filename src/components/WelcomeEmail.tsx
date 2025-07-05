import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
  Tailwind,
  Section,
  Row,
  Column,
  Img,
  Button,
} from "@react-email/components";
import { URLS } from "@/lib/constants";

interface WelcomeEmailProps {
  username: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to AskShot! Your AI-powered screenshot assistant 🎉
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[40px] max-w-[600px] shadow-sm">
            {/* Header with Logo */}
            <Section className="text-center mb-8">
              <Img
                src={URLS.LOGO}
                alt="AskShot Logo"
                width="60"
                height="60"
                className="mx-auto mb-1"
              />
              <Text className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent mb-0">
                AskShot
              </Text>
            </Section>
            {/* Main Content */}
            <Heading className="text-gray-800 text-[24px] font-semibold text-center mb-6 leading-tight">
              Welcome to AskShot!
            </Heading>
            <Text className="text-gray-700 text-[16px] leading-[26px] mb-4">
              Hi {username},
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[26px] mb-6">
              Thank you for signing up with AskShot! We&apos;re excited to have
              you on board. Your AI-powered screenshot assistant is ready to
              help you capture, analyze, and get instant answers from any
              screenshot.
            </Text>
            {/* Extension Download Section */}
            <Section className="text-center mb-8">
              <Row>
                <Column align="center">
                  <Text className="font-bold text-[18px] text-purple-600 leading-[28px] mb-2">
                    Get Started Now
                  </Text>
                  <Text className="text-gray-600 text-[14px] mb-4">
                    Install our browser extension to start using AskShot
                  </Text>
                  <Row>
                    <td align="center">
                      <Button href={URLS.CHROME_EXTENSION}>
                        <Img
                          alt="Add to Chrome"
                          height={54}
                          src={URLS.CHROME_EXTENSION_BUTTON}
                        />
                      </Button>
                    </td>
                  </Row>
                </Column>
              </Row>
            </Section>
            <Text className="text-gray-700 text-[16px] leading-[26px] mb-6 text-center">
              If you have any questions or need help getting started, don&apos;t
              hesitate to reach out to our support team. We&apos;re here to help
              you succeed!
            </Text>
            <Hr className="border border-solid border-gray-200 my-8 mx-0 w-full" />
            {/* Footer */}
            <Section className="text-center">
              <table className="w-full">
                <tr className="w-full">
                  <td align="center">
                    <Img alt="AskShot Logo" height="42" src={URLS.LOGO} />
                  </td>
                </tr>
                <tr className="w-full">
                  <td align="center">
                    <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
                      AskShot
                    </Text>
                    <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
                      Your AI-powered screenshot assistant
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Row className="table-cell h-[44px] w-[56px] align-bottom">
                      <Column className="pr-[8px]">
                        <Link href={URLS.TWITTER}>
                          <Img
                            alt="Twitter/X"
                            height="24"
                            src={URLS.TWITTER_ICON}
                            width="24"
                          />
                        </Link>
                      </Column>
                      <Column className="pr-[8px]">
                        <Link href={URLS.GITHUB}>
                          <Img
                            alt="GitHub"
                            height="24"
                            src={URLS.GITHUB_ICON}
                            width="24"
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href={URLS.LINKEDIN}>
                          <Img
                            alt="LinkedIn"
                            height="24"
                            src={URLS.LINKEDIN_ICON}
                            width="24"
                          />
                        </Link>
                      </Column>
                    </Row>
                  </td>
                </tr>
                {/* <tr>
                  <td align="center">
                    <Text className="my-[8px] text-[14px] text-gray-500 leading-[20px]">
                      Shahwaiz Islam
                    </Text>
                    <Text className="mt-[4px] mb-0 text-[14px] text-gray-500 leading-[20px]">
                      AskShot
                    </Text>
                  </td>
                </tr> */}
              </table>
            </Section>
            <Text className="text-gray-500 text-[12px] leading-[20px] text-center mt-6">
              By signing up, you agree to our{" "}
              <Link
                href={`${baseUrl}/terms`}
                className="text-purple-600 underline hover:text-purple-800"
              >
                Terms of Service
              </Link>
              and
              <Link
                href={`${baseUrl}/privacy`}
                className="text-purple-600 underline hover:text-purple-800"
              >
                Privacy Policy
              </Link>
            </Text>
            <Text className="text-gray-500 text-[12px] leading-[20px] text-center mt-4">
              © 2025 AskShot. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  username: "John Doe",
  userEmail: "john@example.com",
} as WelcomeEmailProps;

export default WelcomeEmail;
