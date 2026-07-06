import { redirect } from "next/navigation";

export default function PrivateHome() {
  redirect("/private/projects");
}
