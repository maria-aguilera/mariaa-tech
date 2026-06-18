import HomeHero from "@/components/HomeHero";
import HomeHighlights from "@/components/HomeHighlights";
import HomeFeatured from "@/components/HomeFeatured";
import HomeContact from "@/components/HomeContact";

export default function Home() {
  return (
    <main id="main-content">
      <HomeHero />
      <HomeHighlights />
      <HomeFeatured />
      <HomeContact />
    </main>
  );
}
