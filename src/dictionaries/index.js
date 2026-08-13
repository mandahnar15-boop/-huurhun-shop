import en from "./en";
import ko from "./ko";
import mn from "./mn";

export const locales = ["ko", "en", "mn"];
export const defaultLocale = "ko";

const dictionaries = { ko, en, mn };

export function getDictionary(locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
