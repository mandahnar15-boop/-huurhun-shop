import en from "./en";
import ko from "./ko";

export const locales = ["ko", "en"];
export const defaultLocale = "ko";

const dictionaries = { ko, en };

export function getDictionary(locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
