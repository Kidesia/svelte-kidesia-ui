<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<div class="badge-row">
	{@render children()}
</div>

<style>
	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
</style>
