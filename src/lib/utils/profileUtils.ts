import type { User, Education, Certificate } from "../../types/user";

/**
 * Type guard to check if education has institutionName (new format)
 */
export function hasInstitutionName(
  edu: Education | { institutionName?: string; institution?: string }
): edu is { institutionName: string } {
  return "institutionName" in edu && !!edu.institutionName;
}

/**
 * Get institution name from education (handles both old and new formats)
 */
export function getInstitutionName(edu: Education | { institutionName?: string; institution?: string }): string {
  if (hasInstitutionName(edu)) {
    return edu.institutionName;
  }
  return edu.institution || "Unknown";
}

/**
 * Type guard to check if certificate has certificateName (new format)
 */
export function hasCertificateName(
  cert: Certificate | { certificateName?: string; name?: string }
): cert is { certificateName: string } {
  return "certificateName" in cert && !!cert.certificateName;
}

/**
 * Get certificate name (handles both old and new formats)
 */
export function getCertificateName(
  cert: Certificate | { certificateName?: string; name?: string }
): string {
  if (hasCertificateName(cert)) {
    return cert.certificateName;
  }
  return cert.name || "Unknown";
}

/**
 * Get certificate issuer (handles both old and new formats)
 */
export function getCertificateIssuer(
  cert: Certificate | { issuer?: string; issuingOrganization?: string }
): string | undefined {
  if ("issuer" in cert) {
    return cert.issuer || undefined;
  }
  return cert.issuingOrganization;
}

/**
 * Get certificate expiration date (handles both old and new formats)
 */
export function getCertificateExpirationDate(
  cert: Certificate | { expirationDate?: string; expiryDate?: string }
): string | undefined {
  if ("expirationDate" in cert) {
    return cert.expirationDate || undefined;
  }
  return cert.expiryDate;
}

/**
 * Check if socialLinks is in new format (has socialLinks array)
 */
export function hasSocialLinksArray(
  socialLinks: User["socialLinks"]
): socialLinks is { socialLinks: Array<{ platform: string; link: string }> } {
  return (
    socialLinks !== null &&
    socialLinks !== undefined &&
    typeof socialLinks === "object" &&
    "socialLinks" in socialLinks &&
    Array.isArray((socialLinks as { socialLinks: unknown }).socialLinks)
  );
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: User): string {
  const firstNameInitial = user.firstName?.[0] ?? "";
  const lastNameInitial = user.lastName?.[0] ?? "";
  const initials = `${firstNameInitial}${lastNameInitial}`.trim();
  
  if (initials) {
    return initials;
  }
  
  return user.userName?.slice(0, 2).toUpperCase() || "U";
}

/**
 * Get user photo URL
 */
export function getUserPhotoUrl(
  user: User,
  photoPreview?: string | null
): string | undefined {
  if (photoPreview) {
    return photoPreview;
  }
  if (user.photoUrl) {
    return user.photoUrl;
  }
  if (user.photo) {
    return String(user.photo);
  }
  return undefined;
}

