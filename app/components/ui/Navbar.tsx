import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router";
import { useUserInform } from "~/stores/useUserInform";

interface NavItem {
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", to: "/" },
  { label: "Thư viện", to: "/library" },
  { label: "Khám phá", to: "/explore" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useUserInform(state => state.basicUserInform);
  const clearBasicUserInform = useUserInform(state => state.clearBasicUserInform);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string>(searchParams.get("q") ?? "");

  const userInitials = useMemo(() => {
    if (!user) return "U";
    const parts: string[] = [user.firstName, user.lastName].filter(Boolean) as string[];
    const initials = parts
      .slice(0, 2)
      .map((part: string) => part?.[0]?.toUpperCase() ?? "")
      .join("");
    return initials || (user.username?.[0]?.toUpperCase() ?? "U");
  }, [user]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-neutral-200/70 bg-white">
      <nav aria-label="Top navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(v => !v)}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <span className="hidden text-lg font-semibold text-neutral-900 sm:inline">VOD</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "text-primary-700 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = keyword.trim();
                  navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
                }}
              >
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-64 rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </form>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-neutral-400">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.4 11.4z" />
                </svg>
              </div>
            </div>

            {user ? (
              <div className="relative group">
                <button className="h-9 w-9 rounded-full bg-neutral-200 text-neutral-700 grid place-items-center font-semibold">
                  {userInitials}
                </button>
                <div className="invisible absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-900 line-clamp-1">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-neutral-500 line-clamp-1">@{user.username}</p>
                  </div>
                  <div className="border-t border-neutral-200" />
                  <div className="py-1">
                    <Link to="/me" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Hồ sơ</Link>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={clearBasicUserInform}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">Đăng nhập</Link>
                <Link to="/register" className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="space-y-1 px-4 pb-4 pt-2">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-base font-medium ${
                  isActive ? "text-primary-700 bg-primary-50" : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
