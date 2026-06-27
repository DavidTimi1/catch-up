import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { lessons } from "@/lib/db/schema";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)],
        },
        moments: {
          orderBy: (moments, { asc }) => [asc(moments.order)],
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Parse the JSON polygons back into objects for the client
    const mappedMoments = lesson.moments.map((m: { polygons: string; }) => ({
      ...m,
      polygons: JSON.parse(m.polygons),
    }));

    return NextResponse.json({
      success: true,
      lesson: {
        ...lesson,
        moments: mappedMoments,
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
