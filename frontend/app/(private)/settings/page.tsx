import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Server-side redirect - no loading flicker
  redirect("/settings/profile");
}
