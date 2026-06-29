import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  Bell,
  Info,
  Palette,
  LogOut,
  KeyRound,
  HelpCircle,
} from "lucide-react";

import hrmsIcon from "@/assets/images/hrms-icon.png";

import { useAppSelector } from "@/hooks/useAppSelector";
import ThemePreset from "./ThemePreset";
import { useGetProfileQuery } from "../../employee/api/employeeApi";

export default function Header() {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showThemePreset, setShowThemePreset] =
    useState(false);

  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const { data: profileData } =
    useGetProfileQuery();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header
      className="
        h-16
        bg-white
        border-b
        flex
        items-center
        justify-between
        px-4
        lg:px-6
        relative
      "
      style={{
        borderColor: `${themeColor}20`,
      }}
    >
      {/* LEFT SECTION */}

      <div className="flex items-center gap-4">
        <img
          src={hrmsIcon}
          alt="HRMS"
          className="w-12 h-12 object-contain"
        />

        <button>
          <Menu
            size={22}
            style={{
              color: themeColor,
            }}
          />
        </button>

        <h1
          className="
    text-base
    lg:text-lg
    font-semibold
    text-slate-900
  "
        >
          {profileData?.data?.CompanyName ||
            "Koundinyasa Technology Services Pvt. Ltd"}
        </h1>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex items-center gap-5">
        {/* INFO */}

        <button>
          <Info
            size={16}
            style={{
              color: themeColor,
            }}
          />
        </button>

        {/* THEME */}

        <div className="relative">
          <button
            onClick={() =>
              setShowThemePreset(
                !showThemePreset
              )
            }
          >
            <Palette
              size={18}
              style={{
                color: themeColor,
              }}
            />
          </button>

          {showThemePreset && (
            <ThemePreset />
          )}
        </div>

        {/* NOTIFICATION */}

        <button>
          <Bell
            size={18}
            style={{
              color: themeColor,
            }}
          />
        </button>

        {/* PROFILE */}

        <div className="relative">
          <button
            onClick={() =>
              setShowProfileMenu(
                !showProfileMenu
              )
            }
            className="
              flex
              items-center
              gap-3
              border
              rounded-full
              px-3
              h-11
              min-w-[250px]
              bg-white
            "
            style={{
              borderColor: `${themeColor}40`,
            }}
          >
            <div
              className="
                w-8
                h-8
                rounded-full
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-semibold
              "
              style={{
                backgroundColor: themeColor,
              }}
            >
              {profileData?.data?.ShortName || "SA"}
            </div>

            <span
              className="
                text-xs
                font-medium
                text-slate-700
                truncate
              "
            >
              {profileData?.data?.Email ||
                "user@koundinyasatech.com"}
            </span>
          </button>

          {showProfileMenu && (
            <div
              className="
                absolute
                right-0
                top-12
                w-[330px]
                bg-white
                rounded-xl
                shadow-xl
                border
                border-slate-200
                overflow-hidden
                z-50
              "
            >
              {/* USER DETAILS */}

              <div className="p-4 flex gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    text-white
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-semibold
                  "
                  style={{
                    backgroundColor:
                      themeColor,
                  }}
                >
                  {profileData?.data?.ShortName || "S"}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    {profileData?.data?.FullName ||
                      "Employee"}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {profileData?.data?.Email ||
                      "user@koundinyasatech.com"}
                  </p>
                </div>
              </div>

              <div className="border-t" />

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  hover:bg-slate-50
                  text-slate-700
                "
              >
                <KeyRound size={18} />
                <span>
                  Change Password
                </span>
              </button>

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  hover:bg-slate-50
                  text-slate-700
                "
              >
                <HelpCircle size={18} />
                <span>Help</span>
              </button>

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  hover:bg-red-50
                  text-red-600
                "
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}