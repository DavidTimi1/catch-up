import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { aiService } from "@/lib/ai";
import { db } from "@/lib/db";
import { lessons, images as imagesTable, moments } from "@/lib/db/schema";
import { saveTempImage, cleanupTempFolder } from "@/lib/utils/tempStorage";
import { withRetry } from "@/lib/utils/retry";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, images } = body; // images is an array of base64 strings

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const lessonId = crypto.randomUUID();

    // 1. Save all images to temporary storage
    const tempImages = await Promise.all(
      images.map(async (base64) => {
        const imageId = crypto.randomUUID();
        const filePath = await saveTempImage(lessonId, imageId, base64);
        return { imageId, filePath };
      })
    );

    const filePaths = tempImages.map((img) => img.filePath);

    // 2. Concurrent Upload to Cloudinary and AI Generation
    const [uploadedImages, momentsData] = await Promise.all([
      withRetry(() => Promise.all(filePaths.map((path) => uploadImage(path)))),
      withRetry(() => aiService.generateMoments(filePaths)),
    ]);

    // 3. Save to Database using Drizzle
    const result = db.transaction((tx) => {
      const [lesson] = tx.insert(lessons).values({
        id: lessonId,
        title: title || "New Note Walkthrough",
      }).returning().all();

      const createdImages = tx.insert(imagesTable).values(
        uploadedImages.map((img, index) => ({
          id: tempImages[index].imageId,
          url: img.url,
          publicId: img.publicId,
          order: index,
          lessonId: lesson.id,
        }))
      ).returning().all();

      const createdMoments = tx.insert(moments).values(
        momentsData.map((mData, index) => {
          const tempImgMatch = tempImages.find((ti) => ti.filePath === mData.imageId) || tempImages[0];
          const dbImage = createdImages.find((img) => img.id === tempImgMatch.imageId);

          return {
            lessonId: lesson.id,
            order: index,
            imageId: dbImage ? dbImage.id : null,
            polygons: JSON.stringify(mData.polygons),
            explanation: mData.explanation,
            extraTitle: mData.extraTitle || null,
            extraBody: mData.extraBody || null,
          };
        })
      ).returning().all();

      return { lessonId: lesson.id, momentsCount: createdMoments.length };
    });

    // 4. Cleanup (commented out internally via utility)
    await cleanupTempFolder(lessonId);

    // 5. Build URL Mapping for frontend to substitute if needed
    const urlMapping: Record<string, string> = {};
    uploadedImages.forEach((img, idx) => {
      urlMapping[filePaths[idx]] = img.url;
    });

    return NextResponse.json({
      success: true,
      lessonId: result.lessonId,
      momentsCount: result.momentsCount,
      urlMapping,
    });
  } catch (error: unknown) {
    console.error("Failed to create lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
