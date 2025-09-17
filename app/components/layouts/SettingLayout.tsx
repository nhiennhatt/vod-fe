import { Outlet, NavLink } from "react-router";

export default function SettingLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cài đặt</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-2">
                <NavLink
                  to="/settings/profile"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Thông tin cá nhân
                </NavLink>
                <NavLink
                  to="/settings/username"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Tên người dùng
                </NavLink>
                <NavLink
                  to="/settings/email"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Email
                </NavLink>
                <NavLink
                  to="/settings/password"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Đổi mật khẩu
                </NavLink>
              </nav>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
