<script lang="ts">
	import type { Component } from 'svelte';

	import i18nState from '$lib/i18n/index.svelte';
	import iconsRegistry from '$lib/utils/icons-registry';
	import type { LoadResult } from '$lib/utils/load-result';
	import { tooltip } from '$lib/utils/tooltip';

	import ConfirmDialog from './ConfirmDialog.svelte';

	type Props = {
		label?: string;
		icon?: Component | keyof typeof iconsRegistry;
		variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'success';
		iconRotation?: number;
		type?: 'button' | 'submit';
		disabled?: boolean;
		tooltip?: string;
		confirmOptions?: {
			title?: string;
			message: string;
			buttonLabel?: string;
		};
		toggled?: boolean;
		onClick: () => Promise<LoadResult<unknown, string>> | void;
	};

	const {
		variant = 'secondary',
		type = 'button',
		label,
		icon,
		iconRotation,
		disabled = false,
		tooltip: tooltipText,
		confirmOptions,
		toggled = false,
		onClick
	}: Props = $props();

	let showConfirm = $state(false);
	let isLoading = $state(false);

	const Icon = $derived(icon && typeof icon === 'string' ? iconsRegistry[icon].outline : icon);

	function handleClick() {
		if (isLoading) return;

		const result = onClick();

		if (result && result instanceof Promise) {
			isLoading = true;
			result.finally(() => {
				isLoading = false;
			});
		}
	}
</script>

{#if showConfirm && confirmOptions}
	<ConfirmDialog
		title={confirmOptions.title ?? i18nState.t('common.confirm')}
		message={confirmOptions.message}
		confirmLabel={confirmOptions.buttonLabel ?? i18nState.t('common.confirm')}
		onConfirm={onClick}
		onClose={() => {
			showConfirm = false;
		}}
	/>
{/if}

<button
	{type}
	class="btn variant-{variant}"
	class:icon-only={!label}
	class:toggled
	disabled={disabled || isLoading}
	{@attach tooltipText ? tooltip(tooltipText) : null}
	onclick={(e) => {
		e.stopPropagation();
		if (confirmOptions) {
			showConfirm = true;
		} else {
			handleClick();
		}
	}}
>
	{#if Icon}
		<div class="icon" style="transform: rotate({iconRotation ?? 0}deg);">
			<Icon />
		</div>
	{/if}
	{#if label}
		<div>{label}</div>
	{/if}
</button>

<style>
	button {
		--btn-bg: var(--color-bg-secondary);
		--btn-fg: var(--color-text-primary);
		--btn-hover-bg: var(--color-bg-secondary);
		--btn-border-color: transparent;
		--btn-icon-color: inherit;

		display: flex;
		flex: 0 0 auto;
		position: relative;
		/* justify-content: center; */
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--btn-border-color);
		background-color: var(--btn-bg);
		color: var(--btn-fg);
		font-weight: 500;
		line-height: 1.25rem;

		&.icon-only {
			padding: 0.5rem;
		}

		&:disabled {
			opacity: 0.5;
		}

		&:not(:disabled):active {
			transform: scale(0.95);
		}

		&:not(:disabled):hover {
			background-color: var(--btn-hover-bg);
		}

		&.variant-primary {
			--btn-bg: var(--color-primary);
			--btn-fg: var(--color-primary-fg);
			--btn-hover-bg: var(--color-primary-hover);
			font-weight: 600;

			&.disabled {
				background-color: var(--color-primary-disabled);
				color: var(--color-text-disabled);
			}

			&.toggled {
				--btn-bg: var(--color-primary);
				--btn-fg: var(--color-primary-fg);
				--btn-hover-bg: var(--color-primary-hover);
			}
		}

		&.variant-secondary {
			--btn-bg: var(--color-bg-secondary);
			--btn-fg: var(--color-text-primary);

			&.toggled {
				--btn-bg: var(--color-interactive-active-bg);
				--btn-fg: var(--color-interactive-active-fg);
				--btn-hover-bg: var(--color-interactive-active-hover);
			}
		}

		&.variant-tertiary {
			--btn-bg: transparent;
			--btn-icon-color: var(--color-text-muted);

			&.toggled {
				--btn-bg: var(--color-primary);
				--btn-fg: var(--color-primary-fg);
				--btn-hover-bg: var(--color-interactive-active-hover);
				--btn-icon-color: inherit;
			}
		}

		&.variant-outline {
			--btn-bg: transparent;
			--btn-fg: var(--color-text-primary);
			--btn-hover-bg: var(--color-bg-secondary);
			--btn-border-color: var(--color-border-primary);

			&.toggled {
				--btn-bg: var(--color-interactive-active-bg);
				--btn-fg: var(--color-interactive-active-fg);
				--btn-hover-bg: var(--color-interactive-active-hover);
				--btn-border-color: transparent;
			}
		}

		&.variant-success {
			--btn-bg: var(--color-success);
			--btn-fg: var(--color-success-fg);
			--btn-hover-bg: var(--color-success-hover);
			font-weight: 600;
			padding: 0.625rem 1rem;
		}
	}

	.icon {
		flex-shrink: 0;
		transition: transform 0.2s ease-in-out;
		color: var(--btn-icon-color);
		font-size: 1.25rem;
		line-height: 1;
	}

	/* On mobile: hide the text label on icon+label buttons inside page
	   action bars (.actions / .sub-header-row / .filter-row), but keep
	   labels visible on standalone buttons (e.g. profile page cards)
	   and inside dialogs. */
	@media (max-width: 768px) {
		:global(.sub-header-row) > :global(.actions) > button:has(.icon),
		:global(.filter-row) > button:has(.icon) {
			padding: 0.5rem;

			> div:not(.icon) {
				display: none;
			}
		}
	}
</style>
