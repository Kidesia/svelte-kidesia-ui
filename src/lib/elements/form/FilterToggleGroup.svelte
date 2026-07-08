<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		ariaLabel?: string;
		children: Snippet;
	};

	const { ariaLabel, children }: Props = $props();
</script>

<div
	class="filter-toggle-group control-surface"
	role={ariaLabel ? 'group' : undefined}
	aria-label={ariaLabel}
>
	{@render children()}
</div>

<style>
	.filter-toggle-group {
		display: inline-flex;
		align-items: stretch;
		flex-shrink: 0;
		overflow: hidden;
	}

	.filter-toggle-group > :global(.filter-toggle-button) {
		border: none;
		border-radius: 0;
		height: calc(1.5rem + 0.5rem);
	}

	.filter-toggle-group > :global(.filter-toggle-button:first-child) {
		border-top-left-radius: calc(0.5rem - 1px);
		border-bottom-left-radius: calc(0.5rem - 1px);
	}

	.filter-toggle-group > :global(.filter-toggle-button:last-child) {
		border-top-right-radius: calc(0.5rem - 1px);
		border-bottom-right-radius: calc(0.5rem - 1px);
	}

	.filter-toggle-group > :global(.filter-toggle-button:not(:first-child)) {
		border-left: 1px solid var(--color-border-primary);
	}

	.filter-toggle-group > :global(.filter-toggle-button:focus-visible) {
		position: relative;
		z-index: 1;
	}
</style>
