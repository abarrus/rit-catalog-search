import type { Action } from "svelte/action";

type ChoicesParams = {
  multiselect: boolean;
};

export const choices: Action<HTMLSelectElement, ChoicesParams> = (
  node,
  params
) => {
  let instance: any;
  const multiselect = params.multiselect ? true : false;

  (async () => {
    const { default: Choices } = await import("choices.js");
    instance = new Choices(node, {
      itemSelectText: undefined,
      searchEnabled: multiselect,
      removeItemButton: multiselect,
      placeholder: multiselect,
      placeholderValue: "Type to search...",
    });
  })();

  return {
    destroy() {
      instance?.destroy();
    },
  };
};
