<script lang="ts">
	import TopBanner from '$lib/components/TopBanner.svelte';
    import DepartureList from '$lib/components/Departure/DepartureList.svelte';
    import { nearby, type NearByArgs, type StationType } from '$lib/hafas-client.remote';

    const nearbyArgs = {
        location: {
            type: "location",
            latitude: 52.521515,
            longitude: 13.411018,
        },
        options: { results: 5 }
    } as NearByArgs

    const nearnbyStations = await nearby(nearbyArgs);

    let selectedStation = $state(nearnbyStations[0] as StationType);
    function selectStation(station: StationType) {
        selectedStation = station
    }
</script>

<TopBanner title="Transport Station"/>

<div id="content" class="flex">
    <div id="stations" class="flex">
        {#each nearnbyStations as station}
            <button onclick={() => selectStation(station)}>{station.name}</button>
        {/each}
    </div>
    <DepartureList station={selectedStation}/>
</div>

<style lang="postcss">
    div#content {
        flex-direction: row
    }
    
    div#stations {
        flex-direction: column
    }
    button {
        border-radius: 10px;
        color: var(--color-btn-fg);
        border-color: var(--color-btn-bg-default);
        background-color: var(--color-btn-bg-default);
        
    }
    button:active {
        border-color: var(--color-btn-bg-active);
        background-color: var(--color-btn-bg-active);
    }
    button:focus {
        border-color: var(--color-btn-bg-focus);
        background-color: var(--color-btn-bg-focus)
    }
</style>