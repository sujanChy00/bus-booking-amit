import NepaliDate from "nepali-date-converter";
export { cn } from "cn";
interface BSDate {
  year: number;
  month: number;
  day: number;
}
export const formattedDate = (date: BSDate | undefined) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (typeof date === "object" && "year" in date) {
    return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  }
  return JSON.stringify(date);
};

export const formatBookingDateTime = (date: number) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const dateFormatterWithSeparator = (
  date: Date,
  separator: string = "-",
) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${separator}${month}${separator}${day}`;
};

export const convertToBsDateStructure = (
  date: string | undefined,
): BSDate | undefined => {
  if (!date) return undefined;

  const parts = date.split("-");

  if (parts.length !== 3) return undefined;

  const [year, month, day] = parts;

  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
};

export const adToBs = (date: Date): BSDate => {
  const nepaliDate = new NepaliDate(date);

  return {
    year: nepaliDate.getYear(),
    month: nepaliDate.getMonth() + 1,
    day: nepaliDate.getDate(),
  };
};

export function getAvatarName(word?: string | null) {
  if (!word?.trim()) return;

  const parts = word.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase();
  }

  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last = parts.at(-1)?.charAt(0).toUpperCase() ?? "";

  return first + last;
}
