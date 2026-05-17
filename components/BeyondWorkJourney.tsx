import SketchPath from "@/components/timeline/SketchPath";
import { chapterPhotos } from "@/lib/journey-photos";
import type { JourneyMilestone } from "@/lib/journey-timeline";

type BeyondWorkJourneyProps = {
  items: JourneyMilestone[];
};

export default function BeyondWorkJourney({ items }: BeyondWorkJourneyProps) {
  return (
    <section className="page-section talks-section bw-journey" aria-label="Personal timeline">
      <SketchPath items={items} photoSets={chapterPhotos} />
    </section>
  );
}
