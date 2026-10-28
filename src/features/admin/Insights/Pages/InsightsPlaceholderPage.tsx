interface InsightsPlaceholderPageProps {
  title: string;
}

export default function InsightsPlaceholderPage({
  title,
}: InsightsPlaceholderPageProps) {
  return (
    <div className="flex min-h-[calc(100vh-130px)] w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-800">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {title} page is ready for development.
        </p>
      </div>
    </div>
  );
}