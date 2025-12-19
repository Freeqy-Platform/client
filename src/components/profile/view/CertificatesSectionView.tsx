import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Award } from "lucide-react";
import type { User } from "../../../types/user";
import {
  getCertificateName,
  getCertificateIssuer,
  getCertificateExpirationDate,
} from "../../../lib/utils/profileUtils";

interface CertificatesSectionViewProps {
  user: User;
}

export const CertificatesSectionView: React.FC<CertificatesSectionViewProps> =
  ({ user }) => {
    return (
      <Card className="mt-4 border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {user.certificates && user.certificates.length > 0 ? (
            <div className="space-y-4">
              {user.certificates.map((cert, index) => (
                <div
                  key={index}
                  className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[var(--purple)] before:rounded-full"
                >
                  <h4 className="font-semibold text-sm">
                    {getCertificateName(cert)}
                  </h4>
                  {getCertificateIssuer(cert) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getCertificateIssuer(cert)}
                    </p>
                  )}
                  {cert.issueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued: {cert.issueDate}
                      {getCertificateExpirationDate(cert) &&
                        ` - Expires: ${getCertificateExpirationDate(cert)}`}
                    </p>
                  )}
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

