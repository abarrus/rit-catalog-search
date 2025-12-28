<script>
	let { data } = $props();
</script>
<style>
    .credits {
        border-radius: 10px;
        border: 1px solid black;
        margin-left: 1rem;
        padding: 0.5rem;
        background-color: blanchedalmond;
        justify-content: center;
    }
</style>
<h1>{data.code}</h1>
{#if data.info}
<h2>{data.info.name}<span class="credits">{data.info.credits} credits</span></h2>
<p>{data.info.desc}</p>
<p>Pre-requisites: {data.info.prereq}</p>
<p>Co-requisites: {data.info.coreq}</p>
<p>May count for:<br>
    {#each data.info.attributes as attr}
        &#emsp;{attr}<br>
    {/each}
</p>
<p>Typically offered: 
    {#each data.info.typically_offered as time}
        {time}, 
    {/each}
</p>
<p>Section name: {data.info.section_name}</p>
{:else}
<p>this course doesn't exist</p>
{/if}
