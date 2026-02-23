<script lang="ts">
	import { lineIconResolver } from '$lib';
	import { now } from '$lib/clock.svelte';
	import { departures, type DepartureArgs, type StationType } from '$lib/hafas-client.remote';
	import { lineSignetStyle } from '$lib/transportColourMap';
	import type { Alternative } from 'hafas-client';

    let { station }: { station?: StationType } = $props();
    const currentTime = $derived.by(now)

    const departuresOptions = $derived({
        station: station,
        options: { duration: 20 }
    } as DepartureArgs)

    const selectedStationDepartures = $derived((await departures(departuresOptions)).departures);

    class PresentableDepartures {
        icon: {src: string, alt: string}
        line: {name: string, style: string}
        direction: string
        arrivesIn: number
        formattedArrivesIn: string

        private static computeArrivesIn(arrival: Alternative): number {
            let arrivalWhen = new Date(arrival.when??arrival.plannedWhen!);
            return arrivalWhen.getTime() - currentTime
        }

        private static formatArrivesIn(arrivesIn: number): string {
            return arrivesIn > 0 ? `in ${arrivesIn}` + (arrivesIn === 1 ? "min" : "mins") : "Now" 
        }

        constructor(departure: Alternative) {
            //console.log(clock.currentTime)
            this.icon = {src: lineIconResolver(departure.line), alt: departure.line?.product??"" }
            this.line = {name: departure.line?.name??"", style: lineSignetStyle(departure.line) }
            this.direction = departure.direction??""
            this.arrivesIn = Math.floor(PresentableDepartures.computeArrivesIn(departure)/1000/60)
            this.formattedArrivesIn = PresentableDepartures.formatArrivesIn(this.arrivesIn)
        }
    }

    const presentableDepartures = $derived(selectedStationDepartures.map((dep) => new PresentableDepartures(dep)))
</script>

<ul id="departures" class="flex">
    {#each presentableDepartures.filter((dep) => dep.arrivesIn >= 0) as dep}
        {@debug dep}
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
        justify-content: space-between;
    }
    #departures li div#name {
        border: 1px;
        border-radius: 10px;
        padding-left: 10px;
        padding-right: 10px
    }
</style>