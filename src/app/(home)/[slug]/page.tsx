import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ModelDetailClient from "@/components/model-detail/ModelDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

async function getModel(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/models/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModel(slug);
  if (!model) return {};

  return {
    title: `${model.name} — ${model.provider?.name ?? model.provider}`,
    description: model.description,
    openGraph: {
      title: `${model.name} — ${model.provider?.name ?? model.provider} | Operis Market`,
      description: model.description,
      ...(model.imageUrl && { images: [{ url: model.imageUrl, alt: model.name }] }),
    },
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getModel(slug);

  if (!model) {
    notFound();
  }

  const normalized = {
    id: model.id,
    name: model.name,
    slug: model.slug,
    provider: model.provider?.name ?? model.provider ?? "",
    description: model.description ?? "",
    category: model.category ?? "chat",
    tags: model.tags ?? [],
    taskTags: model.taskTags ?? [],
    pricing: model.pricingTiers?.[0]
      ? `From ${model.pricingTiers[0].pricePerUnit} credits/${model.pricingTiers[0].unit}`
      : "Contact for pricing",
    image: model.imageUrl,
    gradient: model.gradient ?? "from-violet-500 to-purple-600",
    isNew: model.isNew ?? false,
    isPopular: model.isPopular ?? false,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: normalized.name,
    description: normalized.description,
    brand: { "@type": "Organization", name: normalized.provider },
    url: `https://models.operis.vn/${normalized.slug}`,
    ...(normalized.image && { image: normalized.image }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModelDetailClient model={normalized} />
    </>
  );
}
