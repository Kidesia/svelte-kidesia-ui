<script lang="ts">
	import type { Component } from 'svelte';

	import iconsRegistry from '$lib/utils/icons-registry';
	import { tooltip } from '$lib/utils/tooltip';

	type IconProp = Component | keyof typeof iconsRegistry;

	function resolveIcon(icon: IconProp | undefined, variant: 'default' | 'outline') {
		if (!icon) return undefined;
		return typeof icon === 'string' ? iconsRegistry[icon][variant] : icon;
	}

	type Props = {
		label?: string;
		icon?: IconProp;
		untoggledIcon?: IconProp;
		toggledIcon?: IconProp;
		toggled?: boolean;
		disabled?: boolean;
		tooltip?: string;
		ariaLabel?: string;
		onClick: () => void;
	};

	const {
		label,
		icon,
		untoggledIcon,
		toggledIcon,
		toggled = false,
		disabled = false,
		tooltip: tooltipText,
		ariaLabel,
		onClick
	}: Props = $props();

	const Icon = $derived.by(() => {
		if (toggled) {
			return resolveIcon(toggledIcon ?? icon, 'default');
		}

		return resolveIcon(untoggledIcon ?? icon, 'outline');
	});
	const actualAriaLabel = $derived(ariaLabel ?? label ?? tooltipText);
</script>

<button
	{disabled}
	type="button"
	class="filter-toggle-button control-surface tight-focus"
	class:icon-only={!label}
	aria-pressed={toggled}
	aria-label={actualAriaLabel}
	{@attach tooltipText ? tooltip(tooltipText) : null}
	onclick={(event) => {
		event.stopPropagation();
		onClick();
	}}
>
	{#if Icon}
		<span class="icon" aria-hidden="true">
			<Icon />
		</span>
	{/if}

	{#if label}
		<span class="label">{label}</span>
	{/if}
</button>

<style>
	.filter-toggle-button {
		--toggle-bg: var(--color-bg-surface);
		--toggle-border-color: var(--color-border-primary);
		--toggle-fg: var(--color-text-secondary);
		--toggle-icon-color: currentColor;

		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: calc(1.5rem + 0.5rem + 2px);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--toggle-border-color);
		border-radius: var(--radius-md);
		background: var(--toggle-bg);
		color: var(--toggle-fg);
		line-height: 1.5;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			box-shadow 0.15s ease;

		&:hover:not(:disabled) {
			--toggle-bg: var(--color-interactive-hover-bg);
			--toggle-fg: var(--color-text-primary);
		}

		&[aria-pressed='true'] {
			--toggle-bg: var(--color-interactive-active-bg);
			--toggle-border-color: var(--color-interactive-active-bg);
			--toggle-fg: var(--color-interactive-active-fg);
			--toggle-icon-color: var(--color-icon-active);
		}

		&[aria-pressed='true']:hover:not(:disabled) {
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}

		&.icon-only {
			width: calc(1.5rem + 0.5rem + 2px);
			padding-inline: 0.5rem;
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--toggle-icon-color);
		font-size: 1.125rem;
		line-height: 1;
	}

	.label {
		line-height: 1.5;
		white-space: nowrap;
	}
</style>
