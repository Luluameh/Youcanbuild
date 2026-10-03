import { Card } from "@/components/ui/Card.tsx";

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="py-4">
      <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
    </Card>
  );
}
