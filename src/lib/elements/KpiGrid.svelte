<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		minWidth?: string;
		children: Snippet;
	};

	const { minWidth = '14rem', children }: Props = $props();
</script>

<div class="kpi-grid" style="--kpi-min-width: {minWidth};">
	{@render children()}
</div>

<style>
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--kpi-min-width)), 1fr));
		gap: 1rem;
	}
</style>
