// app/api/nav/route.ts

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const errorChance = 0.1;

// const defaultNav = [
//   { id: 1, title: "Dashboard", target: "/" },
//   {
//     id: 2,
//     title: "Job Applications",
//     target: "/applications",
//     children: [
//       { id: 7, title: "John Doe", target: "/applications/john-doe" },
//       { id: 10, title: "James Bond", target: "/applications/james-bond" },
//       { id: 20, title: "Scarlett Johansson", target: "/applications/scarlett-johansson", visible: false },
//     ],
//   },
//   {
//     id: 3,
//     title: "Companies",
//     target: "/companies",
//     visible: false,
//     children: [
//       { id: 8, title: "Tanqeeb", target: "/companies/1" },
//       { id: 9, title: "Daftra", target: "/companies/2" },
//       { id: 11, title: "TBD", target: "/companies/14" },
//     ],
//   },
//   {
//     id: 4,
//     title: "Qualifications",
//     children: [
//       { id: 14, title: "Q1", target: "/q1" },
//       { id: 15, title: "Q2", target: "/q2" },
//     ],
//   },
//   { id: 5, title: "About", target: "/about" },
//   { id: 6, title: "Contact", target: "/contact" },
// ];

export async function GET() {
  // Simulate error chance:
  if (Math.random() <= errorChance) {
    return NextResponse.json(null, { status: 500 });
  }

  const filePath = path.join(process.cwd(), "nav.json");

  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const navData = JSON.parse(fileContent);
    return NextResponse.json(navData);
  } catch (err) {
    // If file doesn't exist or any error occurs, return default navigation data
    return NextResponse.json(err);
    // return NextResponse.json(defaultNav);
  }
}

export async function POST(request: Request) {
  // Simulate error chance:
  if (Math.random() <= errorChance) {
    return NextResponse.json(null, { status: 500 });
  }

  const items = await request.json();

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "nav.json");

  try {
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error writing nav.json", err);
    return NextResponse.json({ error: "Failed to write nav.json" }, { status: 500 });
  }
}
