import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { models } from "@/data/models";
import ModelDetailClient from "@/components/model-detail/ModelDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return models.map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = models.find((m) => m.slug === slug);
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
  const model = models.find((m) => m.slug === slug);

  if (!model) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: model.name,
    description: model.description,
    brand: { "@type": "Organization", name: model.provider },
    url: `https://operis.market/${model.slug}`,
    ...(model.image && { image: `https://operis.market${model.image}` }),
    offers: {
      "@type": "Offer",
      price: model.pricing,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModelDetailClient model={model} />
    </>
  );
}
