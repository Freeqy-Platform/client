import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Lock,
  Scale,
  Ban,
  CheckCircle,
} from "lucide-react";

const TermsOfService = () => {
  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Last updated: {lastUpdated}
          </p>
          <p className="text-muted-foreground mt-4">
            Please read these Terms and Conditions carefully before using the
            Freeqy platform. By accessing or using our Service, you agree to be
            bound by these Terms.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="acceptance">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Acceptance of Terms
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    By accessing or using the Freeqy platform ("Service"), you
                    agree to be bound by these Terms and Conditions ("Terms").
                    If you disagree with any part of these Terms, you may not
                    access the Service.
                  </p>
                  <p>
                    These Terms apply to all users of the Service, including
                    without limitation users who are browsers, vendors,
                    customers, merchants, and contributors of content.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="definitions">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Definitions
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">"Service"</strong>{" "}
                      refers to the Freeqy web application and all related
                      services.
                    </li>
                    <li>
                      <strong className="text-foreground">"User"</strong> refers
                      to any individual or entity that accesses or uses the
                      Service.
                    </li>
                    <li>
                      <strong className="text-foreground">"Content"</strong>{" "}
                      refers to all information, data, text, software, graphics,
                      and other materials posted on the Service.
                    </li>
                    <li>
                      <strong className="text-foreground">"Account"</strong>{" "}
                      refers to your registered account on the Service.
                    </li>
                    <li>
                      <strong className="text-foreground">"Project"</strong>{" "}
                      refers to any project created, managed, or shared through
                      the Service.
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="account">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Accounts
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Account Registration
                    </h4>
                    <p>
                      To use certain features of the Service, you must register
                      for an account. You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                      <li>
                        Provide accurate, current, and complete information
                      </li>
                      <li>Maintain and update your information as necessary</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>
                        Accept responsibility for all activities under your
                        account
                      </li>
                      <li>Notify us immediately of any unauthorized access</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Account Eligibility
                    </h4>
                    <p>
                      You must be at least 18 years old to create an account. By
                      creating an account, you represent and warrant that you
                      meet this age requirement.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="acceptable-use">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Acceptable Use
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>You agree not to use the Service to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Violate any applicable laws, regulations, or third-party
                      rights
                    </li>
                    <li>Transmit any harmful, offensive, or illegal content</li>
                    <li>
                      Impersonate any person or entity or misrepresent your
                      affiliation
                    </li>
                    <li>Interfere with or disrupt the Service or servers</li>
                    <li>
                      Attempt to gain unauthorized access to any part of the
                      Service
                    </li>
                    <li>
                      Use automated systems to access the Service without
                      permission
                    </li>
                    <li>Collect or harvest information about other users</li>
                    <li>Spam, harass, or harm other users</li>
                    <li>Upload viruses, malware, or other malicious code</li>
                    <li>
                      Use the Service for any commercial purpose without
                      authorization
                    </li>
                  </ul>
                  <p className="mt-4">
                    We reserve the right to suspend or terminate accounts that
                    violate these terms.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="intellectual-property">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Intellectual Property
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Our Intellectual Property
                    </h4>
                    <p>
                      The Service and its original content, features, and
                      functionality are owned by Freeqy and are protected by
                      international copyright, trademark, patent, trade secret,
                      and other intellectual property laws.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Your Content
                    </h4>
                    <p>
                      You retain ownership of any content you post on the
                      Service. By posting content, you grant us a worldwide,
                      non-exclusive, royalty-free license to use, reproduce,
                      modify, and distribute your content solely for the purpose
                      of operating and providing the Service.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      User-Generated Content
                    </h4>
                    <p>
                      You are solely responsible for the content you post. You
                      represent and warrant that you have all necessary rights
                      to post such content and that it does not infringe on any
                      third-party rights.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Projects and Collaboration
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Project Ownership
                    </h4>
                    <p>
                      Project creators retain ownership of their projects. By
                      creating a project, you grant other team members
                      appropriate access rights as specified in your project
                      settings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Project Visibility
                    </h4>
                    <p>
                      You are responsible for setting appropriate visibility
                      settings for your projects. Public projects are visible to
                      all users, while private projects are only visible to
                      authorized team members.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      Team Collaboration
                    </h4>
                    <p>
                      When collaborating on projects, you agree to respect other
                      team members' contributions and maintain professional
                      conduct. Disputes between team members are the
                      responsibility of the parties involved.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Payment Terms
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>If you purchase a paid subscription or service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      You agree to pay all fees associated with your purchase
                    </li>
                    <li>
                      Fees are charged in advance on a recurring basis unless
                      otherwise stated
                    </li>
                    <li>
                      All fees are non-refundable except as required by law
                    </li>
                    <li>
                      We reserve the right to change our pricing with 30 days'
                      notice
                    </li>
                    <li>
                      You are responsible for any taxes applicable to your
                      purchase
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="disclaimers">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Disclaimers
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                    WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                    WARRANT THAT:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Service will be uninterrupted or error-free</li>
                    <li>Defects will be corrected</li>
                    <li>
                      The Service is free of viruses or other harmful components
                    </li>
                    <li>
                      The results obtained from using the Service will be
                      accurate or reliable
                    </li>
                  </ul>
                  <p className="mt-4">
                    We disclaim all warranties, express or implied, including
                    without limitation implied warranties of merchantability,
                    fitness for a particular purpose, and non-infringement.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limitation-liability">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Ban className="h-5 w-5" />
                  Limitation of Liability
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL
                    FREEQY, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE
                    LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                    OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loss of profits, data, or other intangible losses</li>
                    <li>
                      Damages resulting from your use or inability to use the
                      Service
                    </li>
                    <li>
                      Damages resulting from unauthorized access to your account
                    </li>
                    <li>
                      Damages resulting from any conduct or content of third
                      parties
                    </li>
                  </ul>
                  <p className="mt-4">
                    Our total liability to you for all claims arising from or
                    related to the Service shall not exceed the amount you paid
                    us in the twelve (12) months preceding the claim, or $100,
                    whichever is greater.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="termination">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Termination
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may terminate or suspend your account and access to the
                    Service immediately, without prior notice, for any reason,
                    including if you breach these Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will cease
                    immediately. You may terminate your account at any time by
                    contacting us or using the account deletion feature in your
                    settings.
                  </p>
                  <p>
                    All provisions of these Terms that by their nature should
                    survive termination shall survive, including ownership
                    provisions, warranty disclaimers, and limitations of
                    liability.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="governing-law">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Governing Law
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with the laws of laws of Egypt, without regard to its
                    conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising from or relating to these Terms or the
                    Service shall be subject to the exclusive jurisdiction of
                    the courts located in Egypt.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="changes">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Changes to Terms
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We reserve the right to modify or replace these Terms at any
                    time. If a revision is material, we will provide at least 30
                    days' notice prior to any new terms taking effect.
                  </p>
                  <p>
                    What constitutes a material change will be determined at our
                    sole discretion. By continuing to access or use the Service
                    after any revisions become effective, you agree to be bound
                    by the revised terms.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Information
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about these Terms, please contact
                    us:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-foreground">Email:</strong>{" "}
                      <a
                        href="mailto:legal@freeqy.com"
                        className="text-primary hover:underline"
                      >
                        legal@freeqy.com
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
            By using Freeqy, you acknowledge that you have read, understood, and
            agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
