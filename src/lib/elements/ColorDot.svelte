<script lang="ts">
	import { tooltip } from '$lib/utils/tooltip';

	type Props = {
		color?: string | null;
		label?: string;
	};

	const { color, label }: Props = $props();

	const resolvedColor = $derived(
		color ? (color.startsWith('#') ? color : `#${color}`) : 'var(--color-border-secondary)'
	);
</script>

{#if label}
	<span
		class="color-dot"
		style="--dot-color: {resolvedColor};"
		role="img"
		aria-label={label}
		{@attach tooltip(label)}
	></span>
{:else}
	<span class="color-dot" style="--dot-color: {resolvedColor};" aria-hidden="true"></span>
{/if}

<style>
	.color-dot {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		background-color: var(--dot-color);
		flex-shrink: 0;
	}
</style>
