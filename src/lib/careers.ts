export type ApplicationStatus = "NEW" | "REVIEWING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";

export function generateApplicationReference(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "NTS-APP-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function statusPillColors(
  status: ApplicationStatus
): { bg: string; text: string } {
  const colorMap: Record<ApplicationStatus, { bg: string; text: string }> = {
    NEW: { bg: "bg-[#dcfce7]", text: "text-[#15803d]" },
    REVIEWING: { bg: "bg-[#fef3c7]", text: "text-[#92400e]" },
    INTERVIEW: { bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
    OFFER: { bg: "bg-[#ede9fe]", text: "text-[#6d28d9]" },
    HIRED: { bg: "bg-[#d1fae5]", text: "text-[#065f46]" },
    REJECTED: { bg: "bg-[#f3f4f6]", text: "text-[#6b7280]" },
  };

  return colorMap[status] || colorMap.NEW;
}

// Generate deterministic avatar background color from name
export function avatarBgColor(name: string): string {
  const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Light Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Yellow
    "#BB8FCE", // Purple
    "#85C1E2", // Light Blue
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
