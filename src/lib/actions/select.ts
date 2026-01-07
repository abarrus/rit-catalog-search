import type { Action } from "svelte/action";
import { onMount } from "svelte";

export const select: Action<
  HTMLSelectElement,
  { someProperty: boolean } | undefined
> = (node, param = { someProperty: true }) => {
  onMount(async () => {
    await import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const { default: TomSelect } = await import(
      "tom-select/dist/js/tom-select.complete.js"
    );

    new TomSelect(node, {});
  });
};