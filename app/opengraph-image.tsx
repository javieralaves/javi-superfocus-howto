import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "How I use Superfocus, a personal guide by Javier Alaves";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFile(join(process.cwd(), "app/_og", file));

const [serif, serifItalic, sans, sansMedium, avatar, logo] = await Promise.all([
  asset("newsreader-latin-500-normal.ttf"),
  asset("newsreader-latin-500-italic.ttf"),
  asset("dm-sans-latin-400-normal.ttf"),
  asset("dm-sans-latin-500-normal.ttf"),
  asset("javi-avatar.jpg"),
  readFile(join(process.cwd(), "public/sf-logo.svg")),
]);

const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;
const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

const paper = "#fcfcfd";
const ink = "#09090b";
const faded = "#71717a";
const rule = "#e4e4e7";
const columnWidth = 140;
const rowHeight = 70;
const columns = Math.ceil(size.width / columnWidth) + 1;
const rows = Math.ceil(size.height / rowHeight) + 1;
const offsetX = -40;
const offsetY = -20;

const events = [
  { column: 5, row: 2, span: 1.5 },
  { column: 6, row: 4, span: 2 },
  { column: 7, row: 1, span: 1 },
  { column: 7, row: 5.5, span: 1.5 },
  { column: 8, row: 3, span: 2.5 },
  { column: 6, row: 7, span: 1 },
  { column: 8, row: 7.5, span: 1 },
];

function CalendarPattern() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size.width,
        height: size.height,
        display: "flex",
      }}
    >
      {Array.from({ length: columns }, (_, i) => (
        <div
          key={`c${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: offsetX + i * columnWidth,
            width: 1,
            height: size.height,
            backgroundColor: rule,
          }}
        />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={`r${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: offsetY + i * rowHeight,
            width: size.width,
            height: 1,
            backgroundColor: rule,
          }}
        />
      ))}
      {events.map(({ column, row, span }, i) => (
        <div
          key={`e${i}`}
          style={{
            position: "absolute",
            left: offsetX + column * columnWidth + 6,
            top: offsetY + row * rowHeight + 5,
            width: columnWidth - 12,
            height: span * rowHeight - 10,
            borderRadius: 10,
            backgroundColor: "#f1eefd",
            borderLeft: "3px solid #cfc6f7",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          backgroundImage: `linear-gradient(90deg, ${paper} 0%, ${paper} 30%, rgba(252,252,253,0.75) 52%, rgba(252,252,253,0) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          backgroundImage: `linear-gradient(180deg, rgba(252,252,253,0.6) 0%, rgba(252,252,253,0) 25%, rgba(252,252,253,0) 70%, ${paper} 100%)`,
        }}
      />
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          position: "relative",
          backgroundColor: paper,
          fontFamily: "DM Sans",
          color: ink,
        }}
      >
        <CalendarPattern />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 96,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ position: "relative", display: "flex", width: 44, height: 44 }}>
              <img
                alt=""
                src={avatarSrc}
                width={44}
                height={44}
                style={{ borderRadius: 999, border: `1px solid ${rule}` }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -5,
                  bottom: -5,
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: "white",
                  border: `1px solid ${rule}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img alt="" src={logoSrc} width={13} height={13} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 16,
                fontSize: 18,
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontWeight: 500 }}>Javier Alaves</div>
              <div style={{ color: faded }}>Part of the team building Superfocus</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 64,
              fontFamily: "Newsreader",
              fontWeight: 500,
              fontSize: 136,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            <div>How I use</div>
            <div style={{ fontStyle: "italic" }}>Superfocus</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, weight: 500, style: "normal" },
        { name: "Newsreader", data: serifItalic, weight: 500, style: "italic" },
        { name: "DM Sans", data: sans, weight: 400, style: "normal" },
        { name: "DM Sans", data: sansMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
