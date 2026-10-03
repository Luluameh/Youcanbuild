type SectionHeaderProps = {
  title: string;
  description?: string;
};

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl text-ink sm:text-3xl">{title}</h2>
      {description ? <p className="mt-2 text-base leading-7 text-muted">{description}</p> : null}
    </div>
  );
}
