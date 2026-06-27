import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { question, currentMomentId } = body;

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Fetch the lesson to build context
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: { moments: { orderBy: (moments, { asc }) => [asc(moments.order)] } },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Build context string based on the moments up to the current one
    const currentMomentIndex = lesson.moments.findIndex(
      (m) => m.id === currentMomentId
    );
    const relevantMoments =
      currentMomentIndex >= 0
        ? lesson.moments.slice(0, currentMomentIndex + 1)
        : lesson.moments;

    const context = relevantMoments
      .map((m, i) => `Step ${i + 1}: ${m.explanation}`)
      .join("\n");

    const answerResponse = await aiService.answerQuestion(question, context);

    return NextResponse.json({ success: true, ...answerResponse });
    
  } catch (error: unknown) {
    console.error("Failed to answer question:", error);
    return NextResponse.json(
      { error: "Failed to answer question", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
