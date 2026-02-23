import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "レシグル | レシピを検索する";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/NP_Shimizu.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Shimizu",
          fontSize: 160,
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ color: "#ea4335" }}>レ</span>
        <span style={{ color: "#fbbc05" }}>シ</span>
        <span style={{ color: "#34a853" }}>グ</span>
        <span style={{ color: "#ea4335" }}>ル</span>
      </div>
      <div
        style={{
          color: "#5f6368",
          display: "flex",
          fontSize: 36,
          marginTop: 16,
        }}
      >
        レシピを検索する
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          data: font,
          name: "Shimizu",
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
