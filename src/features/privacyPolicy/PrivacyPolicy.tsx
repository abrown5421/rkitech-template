import React from "react";
import { Container, Text, List, ListItem } from "rkitech-components";
import type { PrivacyPolicyProps } from "./privacyPolicyTypes";

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <Container tailwindClasses="flex-col w-full min-h-[calc(100vh-50px)] p-5 mx-auto md:w-4/5 xl:w-3/5">

      <Text
        text="Privacy Policy"
        tailwindClasses="text-xl font-mono text-gray-900"
      />
      <Text
        text="Effective Date: [Insert Date]"
        tailwindClasses="text-sm mb-6 text-gray-700"
      />

      <Text
        text="We value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you interact with our services."
        tailwindClasses="mb-4 text-gray-700"
      />

      <Text
        text="1. Information We Collect"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <List tailwindClasses="mb-4" gap={2}>
        <ListItem tailwindClasses="ml-4">
          Personal Information: Name, email, phone number, or other identifiers
          you provide.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Authentication Information: Login credentials and session tokens.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Cookies and Tracking Technologies: Cookies, web beacons, and pixels to
          track interactions, analytics, and personalize content.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Device and Usage Information: IP address, browser type, OS, pages
          visited, and actions performed.
        </ListItem>
      </List>

      <Text
        text="2. How We Use Your Information"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <List tailwindClasses="mb-4" gap={2}>
        <ListItem tailwindClasses="ml-4">
          Providing, maintaining, and improving our services.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Managing your account and authentication.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Personalizing user experiences.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Monitoring usage trends and service performance.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Communicating updates, security alerts, or promotional messages.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Ensuring compliance with legal obligations and enforcing our terms.
        </ListItem>
      </List>

      <Text
        text="3. Cookies and Tracking"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <List tailwindClasses="mb-4" gap={2}>
        <ListItem tailwindClasses="ml-4">
          Essential Cookies: Required for authentication, security, and basic
          functionality.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Performance & Analytics Cookies: Help us understand how users interact
          with our services.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Functional Cookies: Remember user preferences and settings.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Advertising & Targeting Cookies: May serve personalized content and
          ads.
        </ListItem>
      </List>

      <Text
        text="4. Data Sharing and Disclosure"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <List tailwindClasses="mb-4" gap={2}>
        <ListItem tailwindClasses="ml-4">
          With service providers performing services on our behalf (hosting,
          analytics, marketing).
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          To comply with legal obligations, court orders, or regulatory
          requests.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          To protect rights, property, safety, or security of users or others.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          In connection with mergers, acquisitions, or corporate transactions.
        </ListItem>
      </List>

      <Text text="5. Data Security" tailwindClasses="font-mono mt-4 mb-2" />
      <Text
        text="We implement reasonable safeguards to protect your information. However, no method of transmission over the Internet or electronic storage is completely secure."
        tailwindClasses="mb-4 text-gray-700"
      />

      <Text text="6. Your Choices" tailwindClasses="font-mono mt-4 mb-2" />
      <List tailwindClasses="mb-4" gap={2}>
        <ListItem tailwindClasses="ml-4">
          Account Information: Access, update, or delete your account info
          through settings.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Cookies: Manage through your browser or device settings.
        </ListItem>
        <ListItem tailwindClasses="ml-4">
          Communications: Opt out of promotional emails via unsubscribe
          instructions.
        </ListItem>
      </List>

      <Text
        text="7. Children’s Privacy"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <Text
        text="Our services are not directed to individuals under 13 (or applicable age). We do not knowingly collect information from children."
        tailwindClasses="mb-4 text-gray-700"
      />

      <Text
        text="8. Changes to This Privacy Policy"
        tailwindClasses="font-mono mt-4 mb-2"
      />
      <Text
        text="We may update this Privacy Policy periodically. Updated versions will be posted on our website with the 'Effective Date' updated."
        tailwindClasses="mb-4 text-gray-700"
      />

      <Text text="9. Contact Us" tailwindClasses="font-mono mt-4 mb-2" />
      <Text
        text="If you have questions about this Privacy Policy or how we handle your data, please contact us at:"
        tailwindClasses="mb-6 text-gray-700 whitespace-pre-line"
      />
    </Container>
  );
};

export default PrivacyPolicy;
