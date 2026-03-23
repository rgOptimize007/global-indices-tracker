type LoadingCardProps = {
  title: string;
  description: string;
};

export function LoadingCard({ title, description }: LoadingCardProps) {
  return (
    <article className="remote-card remote-card--fallback" aria-busy="true">
      <p className="eyebrow">Remote loading</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="loading-bar" />
    </article>
  );
}
