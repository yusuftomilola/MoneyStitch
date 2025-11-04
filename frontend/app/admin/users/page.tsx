import { redirect } from "next/navigation";

export default function UsersPage() {
  // Server-side redirect - no loading flicker
  redirect("/admin");
}
