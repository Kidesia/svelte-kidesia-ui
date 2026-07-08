<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<div class="button-row">
	{@render children()}
</div>

<style>
	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
