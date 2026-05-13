import PageHero from "@/components/PageHero";
import SketchJourneyTimeline from "@/components/timeline/SketchJourneyTimeline";
import { timelineItems } from "@/lib/journey-timeline";

export default function PersonalMapPage() {
  return (
    <main className="blog-page">
      <PageHero
        title="Personal Map"
        subtitle="A visual journey through the places, languages, and memories that shaped me"
        icon="map"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <SketchJourneyTimeline items={timelineItems} />
          </div>
        </div>
      </section>
    </main>
  );
}
