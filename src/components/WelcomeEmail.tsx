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
} from "@react-email/components";
import { Sparkles } from "lucide-react";

interface WelcomeEmailProps {
  username: string;
  userEmail: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const WelcomeEmail = ({ username, userEmail }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to AskShot! Your account is ready 🎉</Preview>
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="bg-white border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[40px] max-w-[600px] shadow-sm">
            {/* Header with Logo */}
            <Section className="text-center mb-8">
              <Row>
                <Column align="center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      AskShot
                    </span>
                  </div>
                </Column>
              </Row>
            </Section>

            {/* Main Content */}
            <Heading className="text-gray-800 text-[28px] font-semibold text-center mb-8 leading-tight">
              Welcome to AskShot!
            </Heading>

            <Text className="text-gray-700 text-[16px] leading-[26px] mb-4">
              Hi {username},
            </Text>

            <Text className="text-gray-700 text-[16px] leading-[26px] mb-4">
              Thank you for signing up with AskShot! We&apos;re excited to have
              you on board and can&apos;t wait for you to explore all the
              amazing features we have to offer.
            </Text>

            <Text className="text-gray-700 text-[16px] leading-[26px] mb-6">
              Your account has been successfully created and you&apos;re all set
              to get started. Here&apos;s what you can do next:
            </Text>

            {/* Features Section */}
            <Section className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-6 mb-6">
              <Text className="text-gray-800 text-[16px] font-semibold mb-3">
                🚀 Get Started:
              </Text>
              <Text className="text-gray-700 text-[14px] leading-[22px] mb-2">
                • Explore your profile and customize your settings
              </Text>
              <Text className="text-gray-700 text-[14px] leading-[22px] mb-2">
                • Connect with our community and discover new features
              </Text>
              <Text className="text-gray-700 text-[14px] leading-[22px]">
                • Reach out to our support team if you need any assistance
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-8">
              <Link
                href={`${baseUrl}/profile`}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 rounded-lg text-[16px] font-medium no-underline inline-block shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Access Your Profile
              </Link>
            </Section>

            <Text className="text-gray-700 text-[16px] leading-[26px] mb-6">
              If you have any questions or need help getting started, don&apos;t
              hesitate to reach out to our support team. We&apos;re here to help
              you succeed!
            </Text>

            <Hr className="border border-solid border-gray-200 my-8 mx-0 w-full" />

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-gray-600 text-[14px] leading-[24px] mb-4">
                Best regards,
                <br />
                <strong className="text-gray-800">Shahwaiz Islam</strong>
                <br />
                <span className="text-purple-600 font-medium">
                  AskShot Team
                </span>
              </Text>
            </Section>

            <Hr className="border border-solid border-gray-200 my-6 mx-0 w-full" />

            <Text className="text-gray-500 text-[12px] leading-[20px] text-center">
              This email was sent to{" "}
              <span className="text-gray-700 font-medium">{userEmail}</span>. If
              you didn&apos;t create an account with AskShot, please ignore this
              email.
            </Text>

            <Text className="text-gray-500 text-[12px] leading-[20px] text-center mt-4">
              By signing up, you agree to our{" "}
              <Link
                href={`${baseUrl}/terms`}
                className="text-purple-600 underline hover:text-purple-800"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={`${baseUrl}/privacy`}
                className="text-purple-600 underline hover:text-purple-800"
              >
                Privacy Policy
              </Link>
              .
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
  username: "",
  userEmail: "",
} as WelcomeEmailProps;

export default WelcomeEmail;
