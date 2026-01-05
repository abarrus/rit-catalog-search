<script lang="ts">
  import { onMount } from "svelte";
  import noUiSlider from "nouislider";
  import "nouislider/dist/nouislider.css";

  const { update, path, node } = $props();
  import { options, makeArrayWithValsBetween } from "$lib/js/consts";

  const maxCredits = Math.max(...(options["credits"] as number[]));
  onMount(() => {
    const sliderElem = document.getElementById("slider");
    if (sliderElem) {
      const slider = noUiSlider.create(sliderElem, {
        start: [0, maxCredits],
        step: 1,
        connect: true,
        range: {
          min: Math.min(...node.selected),
          max: Math.max(...node.selected),
        },
      });
      slider.on("set", () => {
        // get slider values
        const pos: string[] = slider.get() as string[];
        const start: number = parseInt(pos[0], 10);
        const end: number = parseInt(pos[1], 10);

        update(path, makeArrayWithValsBetween(start, end));
      });
    }
  });
</script>

<div class="container my-4">
  <div class="row">
    <div class="col-2 text-center">0</div>
    <div class="col-8">
      <div id="slider"></div>
    </div>
    <div class="col-2 text-center">{maxCredits}</div>
  </div>
</div>