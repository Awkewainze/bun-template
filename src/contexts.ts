import { createContext } from "react";

export const ThemeContext = createContext<"light" | "dark">("light");
export const LocalizationContext = createContext<string>("en");
export const UserContext = createContext<string>("");
