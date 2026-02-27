<script lang="ts">
	import '../app.css';
	import favicon from '../assets/favicon.svg'
</script>

<svelte:head>
	<link rel="icon" href={favicon}/>
</svelte:head>

<slot/>
