<script lang="ts">
	type Props = {
		value: number;
		max?: number;
		hue?: number;
	};

	const { value = 0, max = 100, hue = 250 }: Props = $props();

	const percentage = $derived(max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0);
	const overflowPercentage = $derived(
		max > 0 && value > max ? Math.min(((value - max) / max) * 100, 100) : 0
	);
	const isOverflowing = $derived(value > max);
</script>

<div
	class="progress-indicator"
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax={max}
	aria-valuenow={value}
>
	<div
		class="progress-bar"
		style="width: {percentage}%; background-color: oklch(0.7 0.14 {hue})"
	></div>

	{#if isOverflowing}
		<div
			class="progress-bar overflow-bar"
			style="width: {overflowPercentage}%; background-color: oklch(0.45 0.18 {hue})"
		></div>
	{/if}
</div>

<style>
	.progress-indicator {
		position: relative;
		width: 100%;
		height: 0.4rem;
		background-color: var(--color-border-primary);
		border-radius: var(--radius-xs);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		transition: width 0.3s ease;
	}

	.overflow-bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-right: 2px solid var(--color-base-white);
	}
</style>
