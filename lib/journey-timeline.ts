export type JourneyMilestone = {
  period: string;
  place: string;
  city: string;
  country: string;
  location: string;
  description: string;
  summary: string;
  memory: string;
  note?: string;
  flagCode: "es" | "br" | "gr" | "mx" | "ch";
  photo: string;
  stroke: string;
  labelSide: "left" | "right";
  coordinates: {
    x: number;
    y: number;
  };
  panelPosition: {
    x: number;
    y: number;
  };
  palette: {
    start: string;
    end: string;
    accent: string;
    glow: string;
    surface: string;
  };
};

export const timelineItems: JourneyMilestone[] = [
  {
    period: "1997",
    place: "Spain",
    city: "Madrid",
    country: "Spain",
    location: "Madrid, Spain",
    description:
      "Born in Madrid in 1997. The starting point of the story: family, movement, and the beginning of the journey.",
    summary:
      "Born in Madrid on 19 May 1997. The starting point of the story, before I was old enough to understand the story had started.",
    memory: "The story starts with family, motion, and a beginning that already feels shared.",
    note: "Before memory, there was already movement.",
    flagCode: "es",
    photo: "/images/timeline-sketch/spain-baby.png",
    stroke: "#c94d45",
    labelSide: "right",
    coordinates: { x: 16, y: 22 },
    panelPosition: { x: 27, y: 14 },
    palette: {
      start: "#f59e0b",
      end: "#7c2d12",
      accent: "#ffd7a6",
      glow: "#fff1d7",
      surface: "#fff7eb",
    },
  },
  {
    period: "1998–2000",
    place: "Brazil",
    city: "Rio de Janeiro",
    country: "Brazil",
    location: "Rio de Janeiro, Brazil",
    description:
      "Moved to Rio when I was little. It is the chapter where Portuguese came before Spanish and adaptation started very early.",
    summary:
      "Moved to Rio when I was around one. This is where I actually started speaking: Portuguese before Spanish, which is funny because I somehow forgot most of it later.",
    memory: "Brazil made adaptation feel natural before I was old enough to name it.",
    note: "As Batutinhas came before anything that felt like real school.",
    flagCode: "br",
    photo: "/images/timeline-sketch/brazil-swim.png",
    stroke: "#dcb831",
    labelSide: "left",
    coordinates: { x: 74, y: 23 },
    panelPosition: { x: 51, y: 16 },
    palette: {
      start: "#22c55e",
      end: "#14532d",
      accent: "#fde68a",
      glow: "#dcfce7",
      surface: "#f3fff7",
    },
  },
  {
    period: "2001–2003",
    place: "Greece",
    city: "Athens",
    country: "Greece",
    location: "Athens, Greece",
    description:
      "Lived in Athens and went to St. Catherine's International School. My sister was born during this chapter.",
    summary:
      "This is where I first properly went to school: St. Catherine’s International School. My sister was born during this chapter, and Vigo already felt like home even though I never lived there.",
    memory: "Athens turned change from interruption into part of the way I grew up.",
    note: "We always went back to Vigo for holidays, and it still feels like home.",
    flagCode: "gr",
    photo: "/images/timeline-sketch/athens-school.png",
    stroke: "#c94d45",
    labelSide: "right",
    coordinates: { x: 49, y: 42 },
    panelPosition: { x: 56, y: 35 },
    palette: {
      start: "#60a5fa",
      end: "#1d4ed8",
      accent: "#dbeafe",
      glow: "#eff6ff",
      surface: "#f5f9ff",
    },
  },
  {
    period: "2003–2006",
    place: "Mexico",
    city: "Mexico City",
    country: "Mexico",
    location: "Mexico City, Mexico",
    description:
      "Attended Greengates School. This chapter added another culture, another rhythm, and another version of home.",
    summary:
      "My brother and I attended Greengates School. I remember the freedom of living in a condominio, plus golf, tennis, swimming, golf carts, scooter accidents, and Casi, our Labrador.",
    memory: "Mexico made childhood feel wide open: school, sport, freedom, and Casi.",
    note: "Casi was my dream dog and made this chapter unforgettable.",
    flagCode: "mx",
    photo: "/images/timeline-sketch/mexico-dog.png",
    stroke: "#3652b4",
    labelSide: "right",
    coordinates: { x: 18, y: 59 },
    panelPosition: { x: 16, y: 41 },
    palette: {
      start: "#ef4444",
      end: "#7f1d1d",
      accent: "#fecaca",
      glow: "#ffe4d6",
      surface: "#fff5f2",
    },
  },
  {
    period: "2007–2010",
    place: "Switzerland",
    city: "Montreux",
    country: "Switzerland",
    location: "Montreux, Switzerland",
    description:
      "Went to St George’s School of Switzerland. This is where skiing and the French-speaking part of my life became important.",
    summary:
      "After Mexico, life shifted into a different rhythm: more trains, more independence, and much more skiing. I even joined the school ski team, and this is also where piano started.",
    memory: "Montreux gave the journey more independence, more mountains, and more discipline.",
    note: "Winter, trains, ski team, piano, and a much sharper rhythm.",
    flagCode: "ch",
    photo: "/images/timeline-sketch/switzerland-ski.png",
    stroke: "#3652b4",
    labelSide: "left",
    coordinates: { x: 69, y: 63 },
    panelPosition: { x: 71, y: 52 },
    palette: {
      start: "#fb7185",
      end: "#881337",
      accent: "#ffe4e6",
      glow: "#fff1f2",
      surface: "#fff6f8",
    },
  },
  {
    period: "2010–2015",
    place: "Spain",
    city: "Barcelona",
    country: "Spain",
    location: "Barcelona, Spain",
    description:
      "Studied at the British School of Barcelona. This chapter brought the journey back to Spain, but with a much more international version of me.",
    summary:
      "In theory this was moving back to Spain, but after so many international moves it felt more complex than that. I finished school here and learned that good grades came from effort, not magic.",
    memory: "Barcelona was a return to Spain, but with a much more international version of me.",
    note: "Back to Spain, but not back to the beginning.",
    flagCode: "es",
    photo: "/images/timeline-sketch/barcelona-family.png",
    stroke: "#3652b4",
    labelSide: "right",
    coordinates: { x: 26, y: 81 },
    panelPosition: { x: 33, y: 64 },
    palette: {
      start: "#f97316",
      end: "#9a3412",
      accent: "#fed7aa",
      glow: "#fff7ed",
      surface: "#fff8ef",
    },
  },
];

export const journeyTimeline = timelineItems;
