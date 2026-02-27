<script lang="ts">
    import { liveTicker } from "$lib/clock.svelte";
    let { title }: { title: string } = $props();

    const currentTime = $derived.by(liveTicker)
</script>

<div id="banner" class="flex">
    <div>{title}</div>
    <div id="clock">
        {(new Date(currentTime + 500)).toLocaleString("en-CA", {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
            second: "2-digit",
        }).replaceAll(", ", "\u2002")}
    </div>
</div>

<style lang="postcss">
    #banner {
        background-color: var(--color-container-bg-default);
        font-size: var(--text-2xl);
        line-height: var(--text-2xl--line-height);
        color: var(--color-input-fg);
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-inline: var(--spacing-2);
        padding-block: var(--spacing);
    }
    
    #clock {
        font-size: var(--text-xl);
        line-height: var(--text-xl--line-height);
    }
</style>