import type { Action } from "svelte/action";

type ChoicesParams = {
    search?: boolean
}

export const choices: Action<HTMLSelectElement, ChoicesParams> = (node, params) => {
  let instance: any;
  const search = params.search ? true : false;

  (async () => {
    const { default: Choices } = await import("choices.js");
    instance = new Choices(node, {
        itemSelectText: undefined,
        searchEnabled: search
    });
  })();

  return {
    destroy() {
      instance?.destroy();
    }
  };
};