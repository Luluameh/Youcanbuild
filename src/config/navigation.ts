import type { LucideIcon } from "lucide-react";
import { Award, ClipboardList, LayoutDashboard, Map, Users } from "lucide-react";
import type { UserRole } from "@/types/index.ts";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

export const learnerNavigation: NavItem[] = [
  { label: "Dashboard", to: "/learn", icon: LayoutDashboard, end: true },
  { label: "Roadmap", to: "/learn/roadmap", icon: Map },
  { label: "Achievements", to: "/learn/achievements", icon: Award },
  { label: "Mentors", to: "/learn/mentors", icon: Users },
  { label: "My requests", to: "/learn/mentorship", icon: ClipboardList },
];

export const mentorNavigation: NavItem[] = [
  { label: "Dashboard", to: "/mentor", icon: LayoutDashboard, end: true },
  { label: "Requests", to: "/mentor/requests", icon: Users },
];

export function navigationForRole(role: UserRole): NavItem[] {
  return role === "mentor" ? mentorNavigation : learnerNavigation;
}
