import "./globals.css";
import { Baloo_2, DM_Sans } from "next/font/google";
const d = Baloo_2({ subsets: ["latin"], variable: "--fd", weight: ["600", "700", "800"] });
const b = DM_Sans({ subsets: ["latin"], variable: "--fb" });
export const metadata = {
  title: "Little Hearts Pre Primary School | Admissions",
  description: "Apply online for admission at Little Hearts Pre Primary School.",
  icons: { icon: "/logo.png" },
};
export default function RootLayout({ children }) {
  return (<html lang="en"><body className={`${d.variable} ${b.variable}`}>{children}</body></html>);
}
