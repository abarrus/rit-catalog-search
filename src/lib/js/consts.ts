import rawCatalog from "$lib/data/catalog.json";

export const catalog = rawCatalog as CatalogItem[];

const NONE = "NONE";

export type CatalogItem = {
  code: string;
  desc: string;
  name: string;
  credits: number;
  prereq: string;
  coreq: string;
  prereq_list: string[];
  coreq_list: string[];
  contact_hrs: string[];
  typically_offered: string[];
  attributes: string[];
  section_name: string;
};

// everything one can search by
export const keys: (keyof CatalogItem)[] = [
  "attributes",
  "section_name",
  "credits",
  "typically_offered",
  "prereq_list",
  "coreq_list",
  "contact_hrs",
];

export const presentableKeys: Record<keyof CatalogItem, Record<string, string>> = {
  credits: {text: "Credits", icon: "123"},
  prereq_list: {text: "Prerequisites", icon: "list-check"},
  coreq_list: {text: "Corequisites", icon: "link-45deg"},
  contact_hrs: {text: "Contact hours", icon: "clock-fill"},
  typically_offered: {text: "Season", icon: "calendar-event-fill"},
  attributes: {text: "Counts towards", icon: "tags-fill"},
  section_name: {text: "Section", icon: "bookmark-fill"},

  // not used
  code: {text: "Code", icon: ""},
  desc: {text: "Description", icon: ""},
  prereq: {text: "Prerequisites", icon: ""},
  coreq: {text: "Corequisites", icon: ""},
  name: {text: "Name", icon: ""},
};

function setupOptions() {
  keys.forEach((key) => {
    options[key] = [];
  });

  catalog.forEach((item: CatalogItem) => {
    for (const key of keys) {
      const value = item[key];
      let arrayVal: (number | string)[] = Array.isArray(value)
        ? value
        : [value];
      if (arrayVal.length == 0) {
        if (!options[key].includes(NONE)) {
          options[key].push(NONE);
        }
      } else {
        arrayVal.forEach((val) => {
          if (val != null && !options[key].includes(val)) {
            options[key].push(val);
          }
        });
      }
    }
  });

  Object.keys(options).forEach((key) => {
    const arr: (string | number)[] = options[key];

    arr.sort();

    // make sure NONE is at the front
    if (arr.includes(NONE)) {
      const index = arr.indexOf(NONE);
      arr.splice(index, 1);
      arr.unshift(NONE);
    }
  });
}

export const options: Record<string, (number | string)[]> = {};
setupOptions();

export const choices: Record<string, (string | number)[]> = {};
keys.forEach((key) => {
  choices[key] = [];
});

export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function makeArrayWithValsBetween(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
}