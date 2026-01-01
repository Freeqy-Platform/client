import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Award } from "lucide-react";
import type { User } from "../../../types/user";
import {
  getCertificateName,
  getCertificateIssuer,
  getCertificateExpirationDate,
} from "../../../lib/utils/profileUtils";

interface ReadOnlyCertificatesSectionProps {
  user: User;
}

export const ReadOnlyCertificatesSection: React.FC<
  ReadOnlyCertificatesSectionProps
> = ({ user }) => {
  const certificates = user.certificates || [];

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-4 w-4" />
          Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="border-l-2 border-muted pl-4 pb-4 last:pb-0"
              >
                <div className="space-y-1">
                  <h4 className="font-medium text-sm">
                    {getCertificateName(cert)}
                  </h4>
                  {getCertificateIssuer(cert) && (
                    <p className="text-sm text-muted-foreground">
                      Issued by: {getCertificateIssuer(cert)}
                    </p>
                  )}
                  {cert.issueDate && (
                    <p className="text-xs text-muted-foreground">
                      Issued: {formatDate(cert.issueDate)}
                    </p>
                  )}
                  {getCertificateExpirationDate(cert) && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(getCertificateExpirationDate(cert))}
                    </p>
                  )}
                  {cert.credentialId && (
                    <p className="text-xs text-muted-foreground">
                      Credential ID: {cert.credentialId}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--purple)] hover:underline inline-block mt-1"
                    >
                      View Credential
                    </a>
                  )}
                  {cert.description && (
                    <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                      {cert.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No certificates added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

