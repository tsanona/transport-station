<script lang="ts">
	import { liveTicker, minuteTicker } from '$lib/clock.svelte';
	import { departures } from '$lib/hafas-client.remote';
    import type { DepartureArgs, StationType } from '$lib/hafas-client.remote';
    import { PresentableDepartures } from './util'

    let { station }: { station: StationType } = $props();
    const liveTimestamp = $derived.by(liveTicker)
    const minuteTimestamp = $derived.by(minuteTicker)

    const departuresOptions = $derived({
        station: station,
        options: { when: new Date(minuteTimestamp), duration: 20 }
    } as DepartureArgs)

    const selectedStationDepartures = $derived((await departures(departuresOptions)).departures);
    const presentableDepartures = $derived(selectedStationDepartures.map((dep) => new PresentableDepartures(dep, liveTimestamp)))
</script>

<ul id="departures" class="flex">
    {#each presentableDepartures.sort((a, b) => a.arrivesIn - b.arrivesIn) as dep}
        <li class="flex">
            <div class="flex"><img src={dep.icon.src} alt={dep.icon.alt}  width="30" height="30"/></div>
            <div id="name" class="flex" style={dep.line.style}>{dep.line.name}</div>
            <div class="flex">{dep.direction}</div>
            <div class="flex">{dep.formattedArrivesIn}</div>
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
    }
    #departures li div#name {
        border: 1px;
        padding-left: 10px;
        padding-right: 10px
    }
</style>