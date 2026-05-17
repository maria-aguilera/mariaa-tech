// Pinterest API v5 client. Activates when the env vars below are set.
//
//   PINTEREST_ACCESS_TOKEN   — bearer token from developers.pinterest.com
//   PINTEREST_BOARDS_CONFIG  — JSON array, e.g.:
//     [{"id":"640074234480661640","title":"Interior Design Favorites","url":"https://es.pinterest.com/mariaaguilera979797/dise%C3%B1o-de-interiores-que-me-gustan/"}]
//
// Setup steps documented in README-pinterest.md (created alongside this file).

const API_BASE = "https://api.pinterest.com/v5";

type PinterestImageVariant = { url: string; width?: number; height?: number };

type PinterestPin = {
  id: string;
  media?: {
    images?: {
      originals?: PinterestImageVariant;
      "1200x"?: PinterestImageVariant;
      "736x"?: PinterestImageVariant;
      "600x"?: PinterestImageVariant;
    };
  };
  board_id?: string;
};

type PinterestPinsResponse = {
  items: PinterestPin[];
  bookmark?: string;
};

export type BoardConfig = {
  id: string;
  title: string;
  url: string;
};

export type ApiPinSlide = {
  src: string;
  boardTitle: string;
  boardUrl: string;
};

function pickImage(pin: PinterestPin): string | null {
  const imgs = pin.media?.images;
  return (
    imgs?.["1200x"]?.url ??
    imgs?.originals?.url ??
    imgs?.["736x"]?.url ??
    imgs?.["600x"]?.url ??
    null
  );
}

export function getBoardsFromEnv(): BoardConfig[] {
  const raw = process.env.PINTEREST_BOARDS_CONFIG;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as BoardConfig[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isApiConfigured(): boolean {
  return Boolean(process.env.PINTEREST_ACCESS_TOKEN) && getBoardsFromEnv().length > 0;
}

async function getBoardPins(
  boardId: string,
  token: string,
  limit = 20,
): Promise<PinterestPin[]> {
  try {
    const res = await fetch(
      `${API_BASE}/boards/${boardId}/pins?page_size=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data: PinterestPinsResponse = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getPinsViaApi(perBoard = 8): Promise<ApiPinSlide[]> {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const boards = getBoardsFromEnv();
  if (!token || boards.length === 0) return [];

  const results = await Promise.all(
    boards.map(async (board) => {
      const pins = await getBoardPins(board.id, token, perBoard);
      return pins
        .map((pin) => {
          const src = pickImage(pin);
          if (!src) return null;
          return { src, boardTitle: board.title, boardUrl: board.url };
        })
        .filter((x): x is ApiPinSlide => x !== null);
    }),
  );

  return results.flat();
}
