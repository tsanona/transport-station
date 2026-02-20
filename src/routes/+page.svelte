<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { Alternative } from 'hafas-client';
	import TopBanner from '$lib/components/TopBanner.svelte';
    import { nearby, departures } from '$lib/hafas-client.remote';
    import type { NearbyArgs, StationType, DepartureArgs } from '$lib/hafas-client.remote';
    import { lineSignetStyle } from '$lib';

    let nearbyOptions = {
        location: {
            type: "location",
            latitude: 52.521515,
            longitude: 13.411018,
        },
        options: { results: 10 }
    } as NearbyArgs

    let nearnbyStations = await nearby(nearbyOptions);

    let selectedStation = $state(nearnbyStations[0]) as StationType;

    let departuresOptions = $derived({
        station: selectedStation,
    } as DepartureArgs)

    let currentDepartures = $state(await departures(departuresOptions));
    let updateDetparturesTimer: ReturnType<typeof setTimeout>;
    async function updateDetpartures() {
        currentDepartures = await departures(departuresOptions);
        updateDetparturesTimer = setTimeout(updateDetpartures, 1000 * 60)
    }

    function arriveIn(arrival: Alternative): string {
        let currentTime = $state(Date.now());
        let arrivalWhen = new Date(arrival.when!);
        let mins = Math.floor(((arrivalWhen.getTime() - currentTime)/1000)/60);
        return `in ${mins} min`
    }

    onMount(updateDetpartures)
    onDestroy(() => {clearTimeout(updateDetparturesTimer)})
</script>

<TopBanner title="Transport Station"/>

<select bind:value={selectedStation}>
    {#each nearnbyStations as station}
        <option value={station}>{station.name}</option>
    {/each}
</select>

<ul id="departures" class="flex">
    {#each currentDepartures.departures as dep}
        <li class="flex">
            <div class="flex"><img src="/icons/{dep.line?.product ? dep.line?.product : ""}.svg" alt={dep.line?.product}  width="30" height="30"/></div>
            <div id="name" class="flex" style="{lineSignetStyle(dep.line!)}">{dep.line?.name}</div>
            <div class="flex">{dep.direction}</div>
            <div class="flex">{arriveIn(dep)}</div>
        </li>
    {/each}
</ul>

<style lang="postcss">
    #departures {
        flex-direction: column;
        padding-inline: calc(var(--spacing) * 2);
        padding-block: calc(var(--spacing) * 2);
    }
    #departures li {
        list-style: none;
        flex-direction: row;
        justify-content: left;
        align-items: center;
    }
    #departures li div {
        flex-direction: row;
        justify-content: space-between;
    }
    #departures li div#name {
        border: 1px;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px
    }
</style>