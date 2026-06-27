import { LessonViewer } from "@/components/LessonViewer";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonViewer lessonId={id} />;
}
