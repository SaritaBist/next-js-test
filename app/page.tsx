import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect root to the sign-in page
  redirect("/sign-in");
}

