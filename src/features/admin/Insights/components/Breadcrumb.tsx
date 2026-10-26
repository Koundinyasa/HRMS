interface BreadcrumbProps {
  section: string;
  page: string;
}

export default function Breadcrumb({
  section,
  page,
}: BreadcrumbProps) {
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <span>{section}</span>
      <span>/</span>
      <span className="font-medium text-gray-800">{page}</span>
    </div>
  );
}