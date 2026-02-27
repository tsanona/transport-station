<script lang="ts">
	import TopBanner from '$lib/components/TitleBanner.svelte';
    import DeparturesTable from '$lib/components/Departures/Table.svelte';
    import Stations from '$lib/components/Stations.svelte';
    import { nearby } from '$lib/hafas-client.remote';
    import type { NearByArgs } from '$lib/hafas-client.remote';

    const nearbyArgs = {
        location: {
            type: "location",
            latitude: 52.521515,
            longitude: 13.411018,
        },
        options: { results: 5 }
    } as NearByArgs

    const nearnbyStations = await nearby(nearbyArgs);

    let selectedStation = $state(nearnbyStations[0]);
</script>

<TopBanner title="Transport Station"/>

<div id="content" class="flex">
    <Stations stations={nearnbyStations} bind:selectedStation={selectedStation}/>
    <DeparturesTable station={selectedStation} />
</div>

<style lang="postcss">
    #content {
        flex-direction: row;
        align-items: start;
    }
</style>