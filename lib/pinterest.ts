const PIN_URL_REGEX = /https:\/\/i\.pinimg\.com\/[a-z0-9]+x?[0-9]*\/([a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]+\.jpg)/g;

export async function getPinsFromBoard(boardUrl: string, max = 30): Promise<string[]> {
  try {
    const res = await fetch(boardUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const seen = new Set<string>();
    const urls: string[] = [];
    for (const match of html.matchAll(PIN_URL_REGEX)) {
      const path = match[1];
      const filename = path.split("/").pop();
      if (!filename || seen.has(filename)) continue;
      seen.add(filename);
      urls.push(`https://i.pinimg.com/474x/${path}`);
      if (urls.length >= max) break;
    }
    return urls;
  } catch {
    return [];
  }
}
