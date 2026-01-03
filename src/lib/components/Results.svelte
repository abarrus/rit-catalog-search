<script lang="ts">
    const { filteredCatalog } = $props();
    const numResults = $derived(filteredCatalog.length);
</script>
<style>
    .card-link-hover {
        transition: background-color 0.2s;
    }

    .card-link-hover:hover {
        background-color: #f1f3f5;
        cursor: pointer;
    }
</style>
<h2>Results: {numResults}</h2>
<div class="container-fluid text-center">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {#each filteredCatalog as item}
            <div class="col">
                <!--
                    text-decoration-none: no blue underline (since it's a link)
                -->
                <a href="/view/{item.code}" class="text-decoration-none">
                    <!--
                        border rounded: rounded border
                        h-100: fill height of column, regardless of content
                        p-2: padding 2
                        d-flex align-items-center justify-content-center: center items
                        card-link-hover: hover effect
                        text-dark: no blue text
                    -->
                    <div class="border rounded h-100 p-2 d-flex align-items-center justify-content-center card-link-hover text-dark">
                        <!-- m-0 because the paragraphs were throwing off my vertical centering -->
                        <p class="m-0"><strong>{item.code} {item.name}</strong></p>
                    </div>
                </a>
            </div>
        {/each}
    </div>
</div>