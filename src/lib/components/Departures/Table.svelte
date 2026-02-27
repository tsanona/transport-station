<script lang="ts">
	import { minuteTicker } from '$lib/clock.svelte';
	import { departures } from '$lib/hafas-client.remote';
    import type { DepartureArgs, StationStop } from '$lib/hafas-client.remote';
	import type { Alternative, Products } from 'hafas-client';
    import { PresentableDeparture } from '.'
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { derived } from 'svelte/store';
	import { productIconMap } from '$lib';

    let { station }: { station: StationStop } = $props();
    const minuteTimestamp = $derived.by(minuteTicker)

    const departuresOptions = $derived({
        station: station.id,
        options: { when: new Date(minuteTimestamp), duration: 20 }
    } as DepartureArgs)

    let selectedStationDeparturesPromise: Promise<readonly Alternative[]> = $state(Promise.resolve([]))
    $effect(() => {
        selectedStationDeparturesPromise = departures(departuresOptions)
    })

    type GroupedDetarures = {
        [property: string]: Alternative[]
    }

    function groupBy(departures: readonly Alternative[]): [string, Alternative[]][] {
        return Object.entries(departures
            .filter((dep) => !dep.cancelled && dep.stop?.id === station.id)
            .reduce((cumDeps: GroupedDetarures, dep) => {
                (cumDeps[dep.line?.product!] = cumDeps[dep.line?.product!] || []).push(dep)
                return cumDeps
            }, {})
        ).sort((a, b) => a[0].localeCompare(b[0]))
    }

    const groupedDepartures = $derived(await selectedStationDeparturesPromise.then(groupBy))

    function makePresentable(departures: readonly Alternative[]): PresentableDeparture[] {
        return departures
            .map((dep) => new PresentableDeparture(dep, minuteTimestamp))
            //.sort((a, b) => a.arrivesIn - b.arrivesIn)
    }

    const presentableDepartures: [string, PresentableDeparture[]][] = $derived(groupedDepartures.map(([group, dep]) => [group, makePresentable(dep)]))
</script>

<table>
    {#each presentableDepartures as depGroup (depGroup[0])}
        <thead><tr><th><img src={productIconMap(depGroup[0])} width="30" height="30"/></th></tr></thead>
        <tbody>
            {#each depGroup[1] as dep (dep.id)}
                <tr transition:fade={{ duration: 400 }} animate:flip={{ duration: 400 }}>
                    <td><div id="signet" style={dep.line.style}>{dep.line.name}</div></td>
                    <td>{dep.direction}</td>
                    <td>{dep.formattedArrivesIn}</td>
                </tr>
            {/each}
        </tbody>
    {/each}
</table>

<style lang="postcss">
    table {
        table-layout: auto;
        padding-inline: var(--spacing-2);
        padding-block: var(--spacing);
        width: calc(2/3 * 100vw);
    }
    th img {
        vertical-align: middle;
    }
    td {
        padding: var(--spacing);
    }
    td #signet {
        border: 1px;
        padding-left: 5px;
        padding-right: 5px;
        color: white;
        text-align: center;
        vertical-align: middle;
    }
</style>