import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "レシグル | レシピをGoogle検索する";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

export default async function Image(): Promise<ImageResponse> {
  const [shimizuFont, notoFont] = await Promise.all([
    readFile(join(process.cwd(), "src/app/fonts/NP_Shimizu.ttf")),
    fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400&display=swap",
    )
      .then((css) => css.text())
      .then((text) => {
        const url = text.match(
          /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
        )?.[1];

        return url ? fetch(url).then((r) => r.arrayBuffer()) : null;
      }),
  ]);

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
          fontFamily: "Noto Sans JP",
          fontSize: 36,
          marginTop: 16,
        }}
      >
        レシピをGoogle検索する
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          data: shimizuFont,
          name: "Shimizu",
          style: "normal",
          weight: 400,
        },
        ...(notoFont
          ? [
              {
                data: notoFont,
                name: "Noto Sans JP",
                style: "normal" as const,
                weight: 400 as const,
              },
            ]
          : []),
      ],
    },
  );
}
