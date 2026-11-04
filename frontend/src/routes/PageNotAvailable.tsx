import { Link, useLocation, useParams } from "react-router-dom";

/** Shown for an address that is not a Phase 1 page, or not enabled for the user. */
export default function PageNotAvailable() {
  const { domain } = useParams();
  const { pathname } = useLocation();
  const area = /(^|\/)admin(\/|$)/.test(pathname) ? "admin" : "employee";
  const homePath = domain ? `/${domain}/${area}` : `/${area}`;

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">This page is not available</h2>
      <p className="mt-2 text-sm text-slate-500">
        The page you opened does not exist or is not enabled for your account.
      </p>
      <Link
        to={`${homePath}/dashboard`}
        className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
