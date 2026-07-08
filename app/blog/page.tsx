import { redirect } from "next/navigation";

/**
 * /blog used to be the flat index page. It has been renamed to /projects to
 * match the "Projects" tab label in the nav. Individual posts still live at
 * /blog/[slug]; this redirect only affects the index URL so old bookmarks and
 * links continue to resolve.
 */
export default function BlogIndexRedirect() {
  redirect("/projects");
}
