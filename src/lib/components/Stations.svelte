<script lang="ts">
	import { productIconMap, cleanName } from '$lib';
    import type { StationStop } from '$lib/hafas-client.remote';

    let { stations, selectedStation = $bindable() }: { stations: StationStop[], selectedStation: StationStop } = $props();

    function stationIconsMap(station: StationStop): string[] {
        if (station.products) {
            return Object.entries(station.products).flatMap(([prod, isOf]) =>
            isOf ? productIconMap(prod) : []
            );
        } else return [];
    }
</script>

<ul class="flex">
    {#each stations as station}
        <li>
            <button class={["flex", selectedStation.id === station.id ? "selected" : ""]} onclick={() => {selectedStation = station}}>
                <div>{cleanName(station.name!)}</div>
                <div id="products" class="flex">
                    {#each stationIconsMap(station) as iconSrc }
                        <img src={iconSrc} width="20" height="20"/>
                    {/each}
                </div>
            </button>
        </li>
    {/each}
</ul>

<style lang="postcss">
    ul {
        margin: 0;
        flex-direction: column;
        flex-basis: calc(1/3 * 100vw);
        padding-inline: var(--spacing-2);
        padding-block: var(--spacing);
    }
    li {
        display: contents;
    }
    button {
        border-radius: 0.25rem;
        border-width: 2px;
        color: var(--color-btn-fg);
        padding-inline: var(--spacing-2);
        padding-block: var(--spacing);
        border-color: var(--color-btn-bg-default);
        background-color: var(--color-btn-bg-default);
        flex-direction: column;
        align-items: stretch;
    }
    button:hover {
        border-color: var(--color-btn-bg-hover);
        background-color: var(--color-btn-bg-hover); 
    }
    button:active {
        border-color: var(--color-btn-bg-active);
        background-color: var(--color-btn-bg-active);
    }
    button:focus, button.selected {
        border-color: var(--color-btn-bg-focus);
        background-color: var(--color-btn-bg-focus);
    }
    #products {
        flex-direction: row;
        justify-content: center;
    }
</style>