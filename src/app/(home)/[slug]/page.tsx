import type { Metadata } from "next";
import ModelDetailClient from "@/components/model-detail/ModelDetailClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getModel(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/models/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModel(slug);
  if (!model) return {};

  return {
    title: `${model.name} — ${model.provider}`,
    description: model.description,
    openGraph: {
      title: `${model.name} — ${model.provider} | Operis Market`,
      description: model.description,
      ...(model.image && { images: [{ url: model.image, alt: model.name }] }),
    },
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getModel(slug);

  return <ModelDetailClient slug={slug} initialData={model ?? undefined} />;
}
