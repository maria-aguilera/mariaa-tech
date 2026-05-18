import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Maria Aguilera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.75, letterSpacing: 2, textTransform: "uppercase" }}>
          mariaa.tech
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, marginTop: 24, lineHeight: 1.05 }}>
          Maria Aguilera
        </div>
        <div style={{ fontSize: 36, opacity: 0.85, marginTop: 24, maxWidth: 900, lineHeight: 1.3 }}>
          Notes, projects, and writing on building practical data &amp; AI systems.
        </div>
      </div>
    ),
    { ...size },
  );
}
