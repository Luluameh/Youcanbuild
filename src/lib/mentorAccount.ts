import type { AccountMentorProfile } from "@/types/index.ts";

export function resolveMentorCatalogId(profile: AccountMentorProfile | null): string | null {
  return profile?.catalogMentorId ?? null;
}

export function mentorCanManageRequests(profile: AccountMentorProfile | null): boolean {
  return Boolean(resolveMentorCatalogId(profile));
}
