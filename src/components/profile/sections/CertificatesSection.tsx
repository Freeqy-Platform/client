import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Award, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import type { User, UpdateCertificatesRequest } from "../../../types/user";
import { CertificatesEditor } from "../editors/CertificatesEditor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificatesSchema } from "../../../lib/validations/profileSchemas";
import {
  getCertificateName,
  getCertificateIssuer,
  getCertificateExpirationDate,
} from "../../../lib/utils/profileUtils";

interface CertificatesSectionProps {
  user: User;
  onUpdate: (data: UpdateCertificatesRequest) => Promise<void>;
  isUpdating: boolean;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  user,
  onUpdate,
  isUpdating,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateCertificatesRequest>({
    resolver: zodResolver(certificatesSchema),
    defaultValues: {
      certificates: (user.certificates as UpdateCertificatesRequest["certificates"]) || [],
    },
  });

  React.useEffect(() => {
    const certificates = (user.certificates as UpdateCertificatesRequest["certificates"]) || [];
    form.reset({ certificates });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.certificates]);

  const onSubmit = async (data: UpdateCertificatesRequest) => {
    try {
      await onUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating certificates:", error);
    }
  };

  return (
    <Card className="mt-4 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </CardTitle>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                {user.certificates && user.certificates.length > 0 ? "Edit" : "Add"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Certificates</DialogTitle>
                <DialogDescription className="text-sm">
                  Add your professional certificates.
                </DialogDescription>
              </DialogHeader>
              <CertificatesEditor
                form={form}
                onSubmit={onSubmit}
                onCancel={() => setIsEditing(false)}
                isLoading={isUpdating}
              />
            </DialogContent>
          </Dialog>
        </div>
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

