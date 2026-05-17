// =============================================================================
// JOURNEY PHOTOS — edit this file to pick which photos show on the Beyond Work
// sketch-path map popovers and the timeline cards below it.
//
// HOW TO ADD A PHOTO:
//   1. Drop the image file into `public/images/journey/<city-slug>/`
//      (e.g. public/images/journey/madrid/with-brother.jpg)
//   2. Add an entry below in the matching chapter's `photos` array:
//      { src: "/images/journey/madrid/with-brother.jpg",
//        caption: "My brother, two years older than me" }
//
// The `key` field links a chapter here to one in journey-timeline.ts
// (it's `place + period`, e.g. "Spain1997"). Don't change keys.
//
// Captions are optional. When present they show as handwritten-style annotations
// next to the photo in the popover. Leave caption out for a clean photo.
// =============================================================================

export type ChapterPhoto = {
  src: string;
  caption?: string;
};

export type ChapterPhotoSet = {
  key: string; // matches timelineItem.place + timelineItem.period
  photos: ChapterPhoto[];
  // Shown in the popover when photos[] is empty, in place of the dev placeholder.
  // Leave undefined to fall back to the "drop files here" hint.
  emptyNote?: string;
};

export const chapterPhotos: ChapterPhotoSet[] = [
  {
    key: "Spain1997",
    photos: [
      { src: "/images/journey/madrid/baby-laughing.jpg", caption: "Me" },
      {
        src: "/images/journey/madrid/with-brother.jpg",
        caption: "My brother, two years older than me",
      },
    ],
  },
  {
    key: "Brazil1998–2000",
    photos: [
      {
        src: "/images/journey/rio/flamengo-swim.jpg",
        caption: "Flamengo cap — Portuguese came before Spanish",
      },
      {
        src: "/images/journey/rio/batutinhas-music.jpg",
        caption: "As Batutinhas — music, songs, kindergarten",
      },
    ],
  },
  {
    key: "Greece2001–2003",
    photos: [
      {
        src: "/images/journey/athens/st-catherine-uniform.jpg",
        caption: "St. Catherine's — first real school, with my brother",
      },
      {
        src: "/images/journey/athens/sister.jpg",
        caption: "My sister, born here — but Vigo still feels like home",
      },
    ],
  },
  {
    key: "Mexico2003–2006",
    photos: [
      {
        src: "/images/journey/mexico-city/casi.jpg",
        caption: "Casi — newest family member, instantly the favourite",
      },
    ],
  },
  {
    key: "Switzerland2007–2010",
    photos: [
      {
        src: "/images/timeline-sketch/switzerland-ski.png",
        caption: "Ski team — where the discipline really set in",
      },
    ],
  },
  {
    key: "Spain2010–2015",
    photos: [],
  },
];
