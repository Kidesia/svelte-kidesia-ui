<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowBack from '~icons/material-symbols/arrow-back-rounded';
	import ArrowForward from '~icons/material-symbols/arrow-forward-rounded';

	import i18n from '$lib/i18n/index.svelte';
	import { tooltip } from '$lib/utils/tooltip';

	type Props = {
		onPrev: () => void;
		onNext: () => void;
		prevDisabled?: boolean;
		nextDisabled?: boolean;
		prevLabel?: string;
		nextLabel?: string;
		children: Snippet;
	};

	let {
		onPrev,
		onNext,
		prevDisabled = false,
		nextDisabled = false,
		prevLabel = i18n.t('common.previous'),
		nextLabel = i18n.t('common.next'),
		children
	}: Props = $props();
</script>

<div class="stepper-selector control-surface">
	<button
		type="button"
		class="nav-btn"
		disabled={prevDisabled}
		onclick={onPrev}
		{@attach tooltip(prevLabel)}
		aria-label={prevLabel}
	>
		<ArrowBack />
	</button>

	<div class="divider"></div>

	<div class="stepper-content">
		{@render children()}
	</div>

	<div class="divider"></div>

	<button
		type="button"
		class="nav-btn"
		disabled={nextDisabled}
		onclick={onNext}
		{@attach tooltip(nextLabel)}
		aria-label={nextLabel}
	>
		<ArrowForward />
	</button>
</div>

<style>
	.stepper-selector {
		display: inline-flex;
		align-items: stretch;
		width: fit-content;
		height: calc(1.5rem + 0.5rem + 2px);
	}

	.stepper-content {
		display: flex;
		align-items: stretch;
	}

	.stepper-content > :global(*:not(:first-child)) {
		border-left: 1px solid var(--color-border-primary);
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.4rem;
		background: transparent;
		border: none;
		color: var(--color-text-primary);
		cursor: pointer;
		font-size: 1.25rem;
		line-height: 1;

		&:first-child {
			border-radius: calc(var(--radius-md) - 1px) 0 0 calc(var(--radius-md) - 1px);
		}

		&:last-child {
			border-radius: 0 calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0;
		}

		&:hover:not(:disabled) {
			background-color: var(--color-bg-secondary);
		}

		&:disabled {
			opacity: 0.4;
			cursor: default;
		}
	}

	.divider {
		width: 1px;
		background-color: var(--color-border-primary);
		align-self: stretch;
	}
</style>
