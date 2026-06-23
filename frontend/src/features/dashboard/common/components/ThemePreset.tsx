import { themeColors } from "../constants/themeColors";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { setTheme } from "../themeSlice";

export default function ThemePreset() {
  const dispatch = useAppDispatch();

  return (
    <div
      className="
    absolute
    top-10
    right-0
    bg-white
    rounded-xl
    shadow-xl
    p-5
    w-[300px]
    z-50
  "
    >
      <h2 className="text-xl font-semibold mb-4">
        Presets
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {themeColors.map((color) => (
          <button
            key={color}
            style={{
              backgroundColor: color,
            }}
            onClick={() =>
              dispatch(setTheme(color))
            }
            className="
              h-14
              rounded-lg
            "
          />
        ))}
      </div>
    </div>
  );
}