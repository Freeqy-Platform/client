import type {
  User,
  Education,
  Certificate,
  SocialLinks,
  SocialLink,
} from "../../types/user";
import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaWhatsapp,
  FaTelegram,
  FaLink,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaStackOverflow,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiUpwork, SiFiverr } from "react-icons/si";

export function hasInstitutionName(
  edu: Education | { institutionName?: string; institution?: string }
): edu is { institutionName: string } {
  return "institutionName" in edu && !!edu.institutionName;
}

export function getInstitutionName(
  edu: Education | { institutionName?: string; institution?: string }
): string {
  if (hasInstitutionName(edu)) {
    return edu.institutionName;
  }
  return edu.institution || "Unknown";
}

export function hasCertificateName(
  cert: Certificate | { certificateName?: string; name?: string }
): cert is { certificateName: string } {
  return "certificateName" in cert && !!cert.certificateName;
}

export function getCertificateName(
  cert: Certificate | { certificateName?: string; name?: string }
): string {
  if (hasCertificateName(cert)) {
    return cert.certificateName;
  }
  return cert.name || "Unknown";
}

export function getCertificateIssuer(
  cert: Certificate | { issuer?: string; issuingOrganization?: string }
): string | undefined {
  if ("issuer" in cert) {
    return cert.issuer || undefined;
  }
  return cert.issuingOrganization;
}

export function getCertificateExpirationDate(
  cert: Certificate | { expirationDate?: string; expiryDate?: string }
): string | undefined {
  if ("expirationDate" in cert) {
    return cert.expirationDate || undefined;
  }
  return cert.expiryDate;
}

export function hasSocialLinksArray(
  socialLinks:
    | SocialLinks
    | { socialLinks?: SocialLink[] }
    | SocialLink[]
    | undefined
    | null
): socialLinks is { socialLinks: SocialLink[] } {
  return (
    socialLinks !== null &&
    socialLinks !== undefined &&
    typeof socialLinks === "object" &&
    !Array.isArray(socialLinks) &&
    "socialLinks" in socialLinks &&
    Array.isArray(socialLinks.socialLinks)
  );
}

export function isSocialLinksArray(
  socialLinks:
    | SocialLinks
    | { socialLinks?: SocialLink[] }
    | SocialLink[]
    | undefined
    | null
): socialLinks is SocialLink[] {
  return Array.isArray(socialLinks);
}

export function convertSocialLinksToArray(
  socialLinks:
    | SocialLinks
    | { socialLinks?: SocialLink[] }
    | SocialLink[]
    | undefined
    | null
): SocialLink[] {
  if (!socialLinks) {
    return [];
  }

  if (isSocialLinksArray(socialLinks)) {
    return socialLinks;
  }

  if (hasSocialLinksArray(socialLinks)) {
    return socialLinks.socialLinks || [];
  }

  if (
    typeof socialLinks === "object" &&
    !Array.isArray(socialLinks) &&
    "socialLinks" in socialLinks
  ) {
    const nestedLinks = (socialLinks as { socialLinks?: unknown }).socialLinks;
    if (Array.isArray(nestedLinks)) {
      return nestedLinks as SocialLink[];
    }
  }

  // Convert object format { github: "...", linkedin: "..." } to array format
  const links: SocialLink[] = [];
  const socialLinksObj = socialLinks as SocialLinks;

  if (socialLinksObj.github) {
    links.push({ platform: "GitHub", link: socialLinksObj.github });
  }
  if (socialLinksObj.linkedin) {
    links.push({ platform: "LinkedIn", link: socialLinksObj.linkedin });
  }
  if (socialLinksObj.X) {
    links.push({ platform: "X", link: socialLinksObj.X });
  }
  if (socialLinksObj.portfolio) {
    links.push({ platform: "Portfolio", link: socialLinksObj.portfolio });
  }
  if (socialLinksObj.website) {
    links.push({ platform: "Website", link: socialLinksObj.website });
  }

  return links;
}

export const POPULAR_SOCIAL_PLATFORMS = [
  "Facebook",
  "X",
  "LinkedIn",
  "Instagram",
  "GitHub",
  "YouTube",
  "TikTok",
  "Discord",
  "WhatsApp",
  "Telegram",
  "Upwork",
  "Fiverr",
  "Behance",
  "Dribbble",
  "Medium",
  "Stack Overflow",
  "Other",
] as const;

export type SocialPlatform = (typeof POPULAR_SOCIAL_PLATFORMS)[number];

export function getSocialMediaIcon(platform: string): IconType {
  const platformLower = platform.toLowerCase().trim();

  switch (platformLower) {
    case "facebook":
      return FaFacebook;
    case "twitter":
    case "x":
      return FaXTwitter;
    case "linkedin":
      return FaLinkedin;
    case "instagram":
      return FaInstagram;
    case "github":
      return FaGithub;
    case "youtube":
      return FaYoutube;
    case "tiktok":
      return FaTiktok;
    case "discord":
      return FaDiscord;
    case "whatsapp":
      return FaWhatsapp;
    case "telegram":
      return FaTelegram;
    case "upwork":
      return SiUpwork;
    case "fiverr":
      return SiFiverr;
    case "behance":
      return FaBehance;
    case "dribbble":
      return FaDribbble;
    case "medium":
      return FaMedium;
    case "stack overflow":
    case "stackoverflow":
      return FaStackOverflow;
    case "other":
      return FaLink;
    default:
      return FaLink;
  }
}

export function getUserInitials(user: User): string {
  const firstNameInitial = user.firstName?.[0] ?? "";
  const lastNameInitial = user.lastName?.[0] ?? "";
  const initials = `${firstNameInitial}${lastNameInitial}`.trim();

  if (initials) {
    return initials;
  }

  return user.userName?.slice(0, 2).toUpperCase() || "U";
}

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
  return undefined;
}
