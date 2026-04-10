import React from "react";
import { ImageResponse } from "next/og";
import { departments, getDepartmentBySlug } from "@/lib/data";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const department = slug ? getDepartmentBySlug(slug) : departments[0];
  const element = React.createElement(
    "div",
    {
      style: {
        alignItems: "stretch",
        background:
          "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(40,51,88,1) 52%, rgba(201,138,42,1) 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px",
        width: "100%",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "999px",
          color: "#fde5b5",
          display: "flex",
          fontSize: 28,
          letterSpacing: "0.24em",
          padding: "12px 24px",
          textTransform: "uppercase",
          width: "fit-content",
        },
      },
      "Hosei Contact Guide",
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 20,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.08,
          },
        },
        department?.name ?? "Hosei University Contact Map",
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 32,
            lineHeight: 1.5,
            maxWidth: 900,
          },
        },
        department?.shortDescription ??
          "A directory for finding the right office quickly with search, filters, and a relationship map.",
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 28,
          opacity: 0.86,
        },
      },
      "Understand roles / know when to ask / share the right office",
    ),
  );

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
  });
}
