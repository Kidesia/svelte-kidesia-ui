<script lang="ts">
	import type { Component } from 'svelte';

	import iconsRegistry from '$lib/utils/icons-registry';
	import { tooltip } from '$lib/utils/tooltip';

	// TODO: does badge need semantic colors (variant?)
	type Props = {
		label: string;
		icon?: Component | keyof typeof iconsRegistry;
		variant?: 'neutral' | 'info' | 'error' | { hue: number };
		size?: 'xsmall' | 'small' | 'normal';
		tooltipText?: string;
		wrap?: boolean;
	};

	let {
		icon,
		label,
		variant = 'neutral',
		size = 'normal',
		wrap = false,
		tooltipText
	}: Props = $props();

	const Icon = $derived(icon && typeof icon === 'string' ? iconsRegistry[icon].outline : icon);

	// TODO: maybe just associate the other variants with hues too?
	const actualVariant = $derived(typeof variant === 'object' ? 'hue' : variant);
</script>

<div
	class="badge variant-{actualVariant} size-{size}"
	class:wrap
	style="--hue: {typeof variant === 'object' ? variant.hue : ''}"
	{@attach tooltipText ? tooltip(tooltipText) : null}
>
	{#if Icon}
		<span class="icon">
			<Icon />
		</span>
	{/if}
	<span class="label">
		{label}
	</span>
</div>

<style>
	.badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
		max-width: 100%;
		line-height: initial;
		padding: 0.25rem 0.75rem;
		border-radius: var(--radius-md);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		min-width: 2rem;
		user-select: none;

		&.size-small {
			line-height: 1rem;
			font-size: 0.9rem;
		}

		&.size-xsmall {
			line-height: 0.875rem;
			font-size: 0.75rem;
			padding: 0.125rem 0.5rem;
			gap: 0.25rem;
			min-width: unset;
			border-radius: var(--radius-sm);
		}

		&.variant-hue {
			background-color: oklch(var(--tint-soft-bg) var(--hue));
			color: oklch(var(--tint-soft-fg) var(--hue));
		}

		:global(.dark-mode) &.variant-hue {
			background-color: oklch(var(--tint-strong-bg) var(--hue));
			color: oklch(var(--tint-strong-fg) var(--hue));
		}

		&.variant-neutral {
			background-color: var(--color-bg-secondary);
			color: var(--color-text-primary);
		}

		&.variant-info {
			background-color: var(--color-info-surface);
			color: var(--color-info-text);
		}

		&.variant-error {
			background-color: var(--color-error-surface);
			color: var(--color-error-text);
		}

		.icon {
			flex: 0 0 auto;
		}

		.label {
			text-overflow: ellipsis;
			overflow: hidden;
		}

		&.wrap {
			white-space: normal;
			text-overflow: clip;
			overflow: visible;
		}

		&.wrap .label {
			text-overflow: clip;
			overflow: visible;
		}
	}
</style>
