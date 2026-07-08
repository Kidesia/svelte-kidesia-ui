<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import InfoIcon from '~icons/material-symbols/info-outline-rounded';

	import iconsRegistry from '$lib/utils/icons-registry';
	import { tooltip } from '$lib/utils/tooltip';

	type CardProps = {
		title?: string;
		titleInfo?: string;
		icon?: Component | keyof typeof iconsRegistry;
		iconHue?: number;
		href?: string;
		active?: boolean;
		/** Warm accent variant: peach border and a subtle tinted surface. */
		accent?: boolean;
		padded?: boolean;
		onClick?: () => void;
		action?: Snippet;
		children: Snippet;
	};

	const {
		title,
		titleInfo,
		icon,
		iconHue,
		href,
		active,
		accent,
		padded = true,
		onClick,
		action,
		children
	}: CardProps = $props();

	const elementType = $derived(href ? 'a' : onClick ? 'button' : 'div');
	const Icon = $derived(icon && typeof icon === 'string' ? iconsRegistry[icon].outline : icon);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={elementType}
	class="card"
	class:active
	class:accent
	class:has-action={!!action}
	{href}
	onclick={onClick}
	aria-roledescription="card"
>
	{#if title || icon || action}
		<div class="card-header">
			{#if icon || title}
				<div class="card-header-main">
					{#if icon}
						<div class="icon" class:grey={iconHue === undefined} style="--hue: {iconHue}">
							<Icon />
						</div>
					{/if}
					{#if title}
						<h3 class="card-title">
							{title}{#if titleInfo}<span
									class="title-info"
									aria-label={titleInfo}
									{@attach tooltip(titleInfo)}><InfoIcon aria-hidden="true" /></span
								>{/if}
						</h3>
					{/if}
				</div>
			{/if}
			{#if action}
				<div class="card-action">
					{@render action()}
				</div>
			{/if}
		</div>
	{/if}
	<div class="card-content" class:no-padding={!padded}>
		{@render children()}
	</div>
</svelte:element>

<style>
	.card {
		background-color: var(--color-bg-surface);
		border: 1px solid var(--color-border-primary);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		text-decoration: none;

		&:where(button) {
			all: unset;
			background-color: var(--color-bg-surface);
			border: 1px solid var(--color-border-primary);
			border-radius: var(--radius-md);
			display: flex;
			flex-direction: column;
			width: 100%;
			box-sizing: border-box;
			cursor: pointer;
			text-align: left;
		}

		&:link,
		&:visited {
			color: inherit;
		}

		&:link:hover,
		&:visited:hover,
		&:where(button):hover {
			background-color: var(--color-interactive-hover-bg);
		}

		&:where(a):focus-visible,
		&:where(button):focus-visible {
			border-color: var(--color-primary);
			outline: var(--focus-ring);
			outline-offset: -2px;
		}

		&:where(a).has-action:focus-within,
		&:where(button).has-action:focus-within {
			border-color: var(--color-primary);
			outline: var(--focus-ring);
			outline-offset: -2px;
		}

		&.active,
		&.active:hover {
			border-color: var(--color-primary);
			background-color: var(--color-interactive-active-bg);
		}

		&.accent {
			border-color: var(--color-primary);
			background-color: var(--color-primary-subtle);
		}
	}

	.active .card-header {
		border-bottom-color: var(--color-primary);
	}

	.accent .card-header {
		border-bottom-color: var(--color-primary);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.card-header-main {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.card-title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		overflow-wrap: break-word;
		word-break: break-word;
		min-width: 0;
	}

	.title-info {
		display: inline-flex;
		margin-left: 0.35rem;
		vertical-align: -0.15em;
		font-size: 1.05em;
		line-height: 1;
		color: var(--color-text-tertiary);
		cursor: help;
	}
	.title-info:hover {
		color: var(--color-text-secondary);
	}

	.card-action {
		display: flex;
		column-gap: 0.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		min-width: 0;
		overflow: hidden;
	}

	.card-content.no-padding {
		gap: 0;
		padding: 0;
	}

	.icon {
		flex-shrink: 0;
		transition: transform 0.2s ease-in-out;
		background-color: var(--color-bg-subtle);
		color: var(--color-text-tertiary);
		font-size: 1.25rem;
		line-height: 1;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: var(--radius-md);
		display: flex;
		justify-content: center;
		align-items: center;

		&:not(.grey) {
			background-color: oklch(var(--tint-soft-bg) var(--hue));
			color: oklch(var(--tint-soft-fg) var(--hue));
		}

		:global(.dark-mode) &:not(.grey) {
			background-color: oklch(var(--tint-strong-bg) var(--hue));
			color: oklch(var(--tint-strong-fg) var(--hue));
		}
	}
</style>
