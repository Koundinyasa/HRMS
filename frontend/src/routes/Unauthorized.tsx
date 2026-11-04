import { Link, useParams } from "react-router-dom";

import { useAppSelector } from "@/hooks/useAppSelector";
import { getHomePath } from "@/shared/constants/roles";

/** Shown when a signed-in user opens a portal their role does not allow. */
export default function Unauthorized() {
  const { domain: domainParam } = useParams();
  const domainFromStore = useAppSelector((state) => state.domain.domain);
  const roleId = useAppSelector((state) => state.auth.roleId);

  const domain = domainParam || domainFromStore || undefined;
  const homePath = getHomePath(domain, roleId);
  const fallbackPath = domain ? `/${domain}/login` : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-base font-semibold text-slate-800">
          You do not have access to this page
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Your account is not allowed to open this area. If you think this is a
          mistake, contact your administrator.
        </p>
        <Link
          to={homePath ?? fallbackPath}
          className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          {homePath ? "Go to my dashboard" : "Back to sign in"}
        </Link>
      </div>
    </div>
  );
}
