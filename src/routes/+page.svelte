<script lang="ts">
	import TopBanner from '$lib/components/TopBanner.svelte';
    import DepartureList from '$lib/components/DepartureList.svelte';
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
</script>

<TopBanner title="Transport Station" />

<select bind:value={selectedStation} size="{nearnbyStations.length}">
    {#each nearnbyStations as station}
        <option value={station}>{station.name}</option>
    {/each}
</select>

<DepartureList station={selectedStation} />