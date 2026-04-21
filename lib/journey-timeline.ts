export type JourneyMilestone = {
  period: string;
  place: string;
  location: string;
  school: string;
  description: string;
  highlights: string[];
};

// Edit this array to change the Beyond Work timeline chapters.
export const journeyTimeline: JourneyMilestone[] = [
  {
    period: "1997",
    place: "Spain",
    location: "Almeria, Spain",
    school: "Origin story",
    description:
      "Born in Spain, with the first chapter of my story starting in Almeria before a very international childhood.",
    highlights: [
      "The starting point of a very global upbringing.",
      "Family roots that still anchor the rest of the journey.",
      "A reminder that the personal story started long before the CV did.",
    ],
  },
  {
    period: "1998-2000",
    place: "Brazil",
    location: "Brazil",
    school: "As Batutinhas",
    description:
      "Early years in Brazil, including time at As Batutinhas and the start of a multilingual, cross-cultural upbringing.",
    highlights: [
      "First real experience of adapting to a new environment.",
      "Early exposure to different languages and ways of living.",
      "The beginning of feeling comfortable with change.",
    ],
  },
  {
    period: "2001-2003",
    place: "Athens",
    location: "Athens, Greece",
    school: "St Catherine's",
    description:
      "Lived in Athens and studied at St Catherine's, another step in adapting quickly to new places and communities.",
    highlights: [
      "Built confidence in joining new schools and social circles.",
      "Learned how quickly environment can shape perspective.",
      "Grew more curious about people, systems, and cultures.",
    ],
  },
  {
    period: "2003-2006",
    place: "Mexico",
    location: "Mexico",
    school: "Greengates",
    description:
      "Moved to Mexico and attended Greengates, continuing a childhood shaped by change, curiosity, and international classrooms.",
    highlights: [
      "Another reset, another school, another culture to absorb.",
      "A period that strengthened resilience and flexibility.",
      "More evidence that adaptation can become a strength.",
    ],
  },
  {
    period: "2007-2010",
    place: "Switzerland",
    location: "Switzerland",
    school: "St George's",
    description:
      "Studied at St George's while living in Switzerland, a period that added discipline, structure, and a wider global perspective.",
    highlights: [
      "A chapter that added more structure and rigor.",
      "Developed stronger habits around discipline and consistency.",
      "Became more aware of how environment influences performance.",
    ],
  },
  {
    period: "2010-2015",
    place: "Barcelona",
    location: "Barcelona, Spain",
    school: "British School of Barcelona",
    description:
      "Returned to Spain and studied at the British School of Barcelona, where the path toward data, technology, and analytical work became clearer.",
    highlights: [
      "A more stable base after years of moving.",
      "The point where analytical and technical interests started to sharpen.",
      "The bridge between the international childhood and the professional path.",
    ],
  },
];
