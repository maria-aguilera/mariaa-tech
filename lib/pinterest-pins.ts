// =============================================================================
// PINTEREST PINS — pick which pins appear in the "Currently" carousel.
//
// Two ways to add a pin:
//
//  A) Direct Pinterest image URL (fastest):
//     On pinterest.com, right-click any pin and choose "Copy image address".
//     The URL will look like https://i.pinimg.com/736x/.../something.jpg
//     Paste it into a new entry below.
//
//  B) Local file (most control):
//     Drop your image into `public/images/pinterest/` and reference it as
//     `/images/pinterest/your-file.jpg`.
//
// Each pin links to a board when clicked. Pick which board feels right
// in `boardTitle` + `boardUrl`. Leave the array empty to hide the carousel
// entirely.
// =============================================================================

export type PinterestSlide = {
  src: string;
  boardTitle: string;
  boardUrl: string;
};

// Add your pins below — duplicate an entry and edit `src` for each.
const INTERIORS =
  "https://es.pinterest.com/mariaaguilera979797/dise%C3%B1o-de-interiores-que-me-gustan/";
const FINDS =
  "https://es.pinterest.com/mariaaguilera979797/design-finds-objects-furniture/";
const STYLES =
  "https://es.pinterest.com/mariaaguilera979797/estilos-dise%C3%B1o-de-interiores-que-me-gustan/";

export const pinterestSlides: PinterestSlide[] = [
  {
    src: "https://i.pinimg.com/1200x/d4/1a/84/d41a84ace6de35d78ac1170bf379b1e3.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/63/d2/90/63d290165d6f320e7f94974b471cd344.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/1d/1c/6b/1d1c6b0b7c1880129296a2a56567173f.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/1a/a9/ae/1aa9aec402da446a200a911152866eaf.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/cb/c4/07/cbc407827bb567b6f9dcc76392806873.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/40/7c/51/407c512177e0512943bd05bd14e2f663.jpg",
    boardTitle: "Design Finds · Objects & Furniture",
    boardUrl: FINDS,
  },
  {
    src: "https://i.pinimg.com/1200x/29/5a/be/295abe284ef5a67dfac0dc991361d1ad.jpg",
    boardTitle: "Interior Design Styles",
    boardUrl: STYLES,
  },
  {
    src: "https://i.pinimg.com/1200x/dd/d0/a5/ddd0a5f9e93c07ae431fe06b7250db9a.jpg",
    boardTitle: "Pin · SES BRISES",
    boardUrl: "https://es.pinterest.com/pin/22095854416780341/",
  },
];
