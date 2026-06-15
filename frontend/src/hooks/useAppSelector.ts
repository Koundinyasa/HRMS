import { useSelector } from "react-redux";
import type { RootState } from "@/app/rootReducer";

export const useAppSelector =
  useSelector.withTypes<RootState>();