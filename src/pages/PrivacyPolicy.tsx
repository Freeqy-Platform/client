import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Lock, Eye, FileText, UserCheck, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Last updated: {lastUpdated}
          </p>
          <p className="text-muted-foreground mt-4">
            At Freeqy, we are committed to protecting your privacy and ensuring
            the security of your personal information. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our platform.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="introduction">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Introduction
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to Freeqy ("we," "our," or "us"). This Privacy
                    Policy describes how we collect, use, process, and protect
                    your personal information when you use our web application
                    and related services (collectively, the "Service").
                  </p>
                  <p>
                    By using our Service, you agree to the collection and use of
                    information in accordance with this policy. If you do not
                    agree with our policies and practices, please do not use our
                    Service.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="information-collection">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Information We Collect
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Personal Information
                    </h4>
                    <p>
                      We collect information that you provide directly to us,
                      including:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Name, email address, and username</li>
                      <li>Profile information (photo, bio, skills, education)</li>
                      <li>Project-related information and content</li>
                      <li>Communication preferences</li>
                      <li>Payment information (processed securely through third-party providers)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Automatically Collected Information
                    </h4>
                    <p>
                      When you use our Service, we automatically collect certain
                      information, including:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Device information and browser type</li>
                      <li>IP address and location data</li>
                      <li>Usage patterns and interaction data</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-we-use">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  How We Use Your Information
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">Provide and maintain</strong> our Service
                    </li>
                    <li>
                      <strong className="text-foreground">Process transactions</strong> and manage your account
                    </li>
                    <li>
                      <strong className="text-foreground">Communicate with you</strong> about your account, projects, and updates
                    </li>
                    <li>
                      <strong className="text-foreground">Improve and personalize</strong> your experience
                    </li>
                    <li>
                      <strong className="text-foreground">Facilitate collaboration</strong> between team members
                    </li>
                    <li>
                      <strong className="text-foreground">Analyze usage patterns</strong> to enhance our platform
                    </li>
                    <li>
                      <strong className="text-foreground">Ensure security</strong> and prevent fraud
                    </li>
                    <li>
                      <strong className="text-foreground">Comply with legal obligations</strong>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-sharing">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Sharing and Disclosure
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We do not sell your personal information. We may share your
                    information only in the following circumstances:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        With Your Consent
                      </h4>
                      <p>
                        We may share your information when you explicitly consent
                        to such sharing.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Service Providers
                      </h4>
                      <p>
                        We may share information with third-party service
                        providers who perform services on our behalf, such as
                        hosting, analytics, and payment processing.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Legal Requirements
                      </h4>
                      <p>
                        We may disclose information if required by law or in
                        response to valid legal requests.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Business Transfers
                      </h4>
                      <p>
                        In the event of a merger, acquisition, or sale of assets,
                        your information may be transferred as part of that
                        transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-security">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                    These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure data storage and backup procedures</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="mt-4">
                    However, no method of transmission over the Internet or
                    electronic storage is 100% secure. While we strive to use
                    commercially acceptable means to protect your information, we
                    cannot guarantee absolute security.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="your-rights">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Your Rights and Choices
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">Access:</strong> Request access to your personal data
                    </li>
                    <li>
                      <strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete data
                    </li>
                    <li>
                      <strong className="text-foreground">Deletion:</strong> Request deletion of your personal data
                    </li>
                    <li>
                      <strong className="text-foreground">Portability:</strong> Request transfer of your data to another service
                    </li>
                    <li>
                      <strong className="text-foreground">Objection:</strong> Object to processing of your data
                    </li>
                    <li>
                      <strong className="text-foreground">Restriction:</strong> Request restriction of processing
                    </li>
                    <li>
                      <strong className="text-foreground">Withdraw Consent:</strong> Withdraw consent at any time
                    </li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us at{" "}
                    <a
                      href="mailto:privacy@freeqy.com"
                      className="text-primary hover:underline"
                    >
                      privacy@freeqy.com
                    </a>
                    . We will respond to your request within 30 days.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cookies">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cookies and Tracking Technologies
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar tracking technologies to track
                    activity on our Service and store certain information.
                    Cookies are files with a small amount of data that may
                    include an anonymous unique identifier.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Types of Cookies We Use
                      </h4>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>
                          <strong className="text-foreground">Essential Cookies:</strong> Required for the Service to function
                        </li>
                        <li>
                          <strong className="text-foreground">Analytics Cookies:</strong> Help us understand how users interact with our Service
                        </li>
                        <li>
                          <strong className="text-foreground">Preference Cookies:</strong> Remember your settings and preferences
                        </li>
                      </ul>
                    </div>
                    <p>
                      You can instruct your browser to refuse all cookies or to
                      indicate when a cookie is being sent. However, if you do
                      not accept cookies, you may not be able to use some
                      portions of our Service.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-retention">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Retention
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We retain your personal information only for as long as
                    necessary to fulfill the purposes outlined in this Privacy
                    Policy, unless a longer retention period is required or
                    permitted by law.
                  </p>
                  <p>
                    When we no longer need your personal information, we will
                    securely delete or anonymize it. Account information is
                    retained until you request deletion or your account is
                    inactive for an extended period.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="children-privacy">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Children's Privacy
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our Service is not intended for individuals under the age of
                    18. We do not knowingly collect personal information from
                    children under 18. If you are a parent or guardian and
                    believe your child has provided us with personal
                    information, please contact us immediately.
                  </p>
                  <p>
                    If we become aware that we have collected personal
                    information from a child under 18, we will take steps to
                    delete such information from our servers.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="international-transfers">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  International Data Transfers
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your information may be transferred to and maintained on
                    computers located outside of your state, province, country,
                    or other governmental jurisdiction where data protection laws
                    may differ.
                  </p>
                  <p>
                    By using our Service, you consent to the transfer of your
                    information to our facilities and those third parties with
                    whom we share it as described in this Privacy Policy.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="changes">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Changes to This Privacy Policy
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    You are advised to review this Privacy Policy periodically
                    for any changes. Changes to this Privacy Policy are
                    effective when they are posted on this page.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Contact Us
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-foreground">Email:</strong>{" "}
                      <a
                        href="mailto:privacy@freeqy.com"
                        className="text-primary hover:underline"
                      >
                        privacy@freeqy.com
                      </a>
                    </p>
                    <p>
                      <strong className="text-foreground">Support:</strong>{" "}
                      <a
                        href="mailto:support@freeqy.com"
                        className="text-primary hover:underline"
                      >
                        support@freeqy.com
                      </a>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground text-center">
            By using Freeqy, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
