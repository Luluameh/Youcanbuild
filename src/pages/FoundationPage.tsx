import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { EmptyState } from "@/components/ui/EmptyState.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { SectionHeader } from "@/components/ui/SectionHeader.tsx";
import { site } from "@/config/site.ts";

type FoundationPageProps = {
  title: string;
  description: string;
  phase: string;
  empty?: boolean;
};

export function FoundationPage({ title, description, phase, empty = false }: FoundationPageProps) {
  useEffect(() => {
    document.title = `${title} · ${site.name}`;
  }, [title]);

  if (empty) {
    return (
      <div className="mx-auto w-full max-w-3xl py-16">
        <EmptyState
          title={title}
          description={description}
          action={<ButtonLink to="/">Back to start</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-10 lg:py-14">
      <PageHeader eyebrow={site.name} title={title} description={description} />
      <Card className="mt-8">
        <SectionHeader
          title={phase}
          description="Navigation, layout, and the learning catalog are ready. This screen will be replaced as that part of the product is built."
        />
      </Card>
    </div>
  );
}
