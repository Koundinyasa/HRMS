import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Menu,
  Bell,
  CircleHelp,
  Palette,
  LogOut,
  KeyRound,
  HelpCircle,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import ThemePreset from "./ThemePreset";

export default function Header() {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  const [showThemePreset, setShowThemePreset] =
    useState(false);

  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header
      className="
        h-14
        border-b
        flex
        items-center
        justify-between
        px-4
        lg:px-6
        relative
      "
      style={{
        backgroundColor: `${themeColor}15`,
        borderColor: `${themeColor}30`,
      }}
    >
      {/* LEFT */}

      <div className="flex items-center gap-4">
        {/* Logo */}

        <div
          className="
            w-9
            h-9
            rounded-lg
            text-white
            flex
            items-center
            justify-center
            font-bold
          "
          style={{
            backgroundColor: themeColor,
          }}
        >
          K
        </div>

        {/* Menu */}

        <button>
          <Menu
            size={20}
            style={{
              color: themeColor,
            }}
          />
        </button>

        {/* Company Name */}

        <h1
          className="
            text-sm
            lg:text-base
            font-semibold
            text-slate-900
          "
        >
          Koundinyasa Technology Services Pvt. Ltd.
        </h1>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">
        {/* Help */}

        <button>
          <CircleHelp
            size={18}
            style={{
              color: themeColor,
            }}
          />
        </button>

        {/* Theme */}

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

        {/* Notification */}

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
              py-1
              min-w-[280px]
            "
            style={{
              borderColor: `${themeColor}50`,
            }}
          >
            <div
              className="
                w-9
                h-9
                rounded-full
                text-white
                flex
                items-center
                justify-center
                font-semibold
              "
              style={{
                backgroundColor: themeColor,
              }}
            >
              SA
            </div>

            <span
              className="
                text-sm
                text-slate-700
                truncate
              "
            >
              user@koundinyasatech.com
            </span>
          </button>

          {showProfileMenu && (
            <div
              className="
                absolute
                right-0
                top-14
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
              {/* User Info */}

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
                  S
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Sathwika.A@koundinyasatech.com
                  </h3>

                  <p className="text-sm text-slate-500">
                    Sathwika.A@koundinyasatech.com
                  </p>
                </div>
              </div>

              <div className="border-t" />

              {/* Change Password */}

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

              {/* Help */}

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

              {/* Sign Out */}

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