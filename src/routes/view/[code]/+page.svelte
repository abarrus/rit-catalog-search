<script>
	let { data } = $props();
</script>
<h1>{data.code}</h1>
{#if data.info}
<div class="d-flex align-content-center">
    <h2>{data.info.name}</h2>
    <div class="ms-2 border-dark card bg-info border rounded p-2">{data.info.credits} credits</div>
</div>
<p>{data.info.desc}</p>
<p>Pre-requisites: {data.info.prereq}</p>
<p>Co-requisites: {data.info.coreq}</p>
<p>May count for:<br>
    {#each data.info.attributes as attr}
        {attr}, 
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
