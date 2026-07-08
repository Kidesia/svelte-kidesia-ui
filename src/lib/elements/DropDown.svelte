<script lang="ts">
	import { type Component, onDestroy, type Snippet } from 'svelte';
	import { createFloatingActions } from 'svelte-floating-ui';
	import { flip, offset, shift, size } from 'svelte-floating-ui/dom';
	import Close from '~icons/material-symbols/close-rounded';
	import ExpandLess from '~icons/material-symbols/expand-less-rounded';
	import ExpandMore from '~icons/material-symbols/expand-more-rounded';

	import iconsRegistry from '$lib/utils/icons-registry';

	import Portal from './Portal.svelte';

	type Props = {
		trigger?: Snippet<[isOpen: boolean]>;
		triggerStyle?: 'button' | 'filter';
		active?: boolean;
		stretchTrigger?: boolean;
		icon?: Component | keyof typeof iconsRegistry;
		labelPrefix?: string;
		label?: string;
		noPadding?: boolean;
		ariaLabel?: string;
		showCloseButton?: boolean;
		closeButtonLabel?: string;
		children: Snippet;
	};

	const {
		trigger,
		triggerStyle = 'button',
		active = false,
		stretchTrigger = false,
		icon,
		labelPrefix,
		label,
		noPadding = false,
		ariaLabel,
		showCloseButton = true,
		closeButtonLabel = 'Close',
		children
	}: Props = $props();

	const Icon = $derived(icon && typeof icon === 'string' ? iconsRegistry[icon].outline : icon);
	const dropdownId = `dropdown-${Math.random().toString(36).slice(2, 11)}`;

	const [floatingRef, floatingContent] = createFloatingActions({
		placement: 'bottom-start',
		strategy: 'fixed',
		middleware: [
			offset(4),
			flip({ padding: 8 }),
			shift({ padding: 8 }),
			size({
				padding: 8,
				apply({ availableWidth, availableHeight, elements }) {
					elements.floating.style.setProperty('--dropdown-available-width', `${availableWidth}px`);
					elements.floating.style.setProperty(
						'--dropdown-available-height',
						`${availableHeight}px`
					);
				}
			})
		]
	});

	let isOpen = $state(false);
	let contentRef: HTMLDivElement | null = $state(null);
	let buttonRef: HTMLButtonElement | null = $state(null);

	const handleClickOutside = function (event: MouseEvent) {
		if (
			buttonRef &&
			contentRef &&
			event.target instanceof Node &&
			!buttonRef.contains(event.target) &&
			!contentRef.contains(event.target)
		) {
			isOpen = false;
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			// Consume the event so outer layers (e.g. an open Drawer) stay put.
			event.stopPropagation();
			isOpen = false;
		}
	};

	function closeDropdown() {
		isOpen = false;
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
		document.removeEventListener('keydown', handleKeydown);
	});
</script>

<button
	class="dropdown-trigger"
	type="button"
	aria-haspopup="true"
	aria-expanded={isOpen}
	aria-controls={isOpen ? dropdownId : undefined}
	aria-label={ariaLabel}
	class:button-trigger={!trigger && triggerStyle === 'button'}
	class:filter-trigger={!trigger && triggerStyle === 'filter'}
	class:control-surface={!trigger && triggerStyle === 'filter'}
	class:active={!trigger && triggerStyle === 'filter' && active}
	class:stretch={stretchTrigger}
	use:floatingRef
	bind:this={buttonRef}
	onclick={() => {
		isOpen = !isOpen;
	}}
>
	{#if trigger}
		{@render trigger(isOpen)}
	{:else if Icon || labelPrefix || label}
		<div class="trigger-content" class:filter={triggerStyle === 'filter'}>
			{#if Icon}
				<Icon />
			{/if}
			{#if labelPrefix || label}
				<span class="label-text">
					{#if labelPrefix}{labelPrefix}:{/if}
					<strong>{label ?? ''}</strong>
				</span>
				<span class="chevron" aria-hidden="true">
					{#if isOpen}<ExpandLess />{:else}<ExpandMore />{/if}
				</span>
			{/if}
		</div>
	{/if}
</button>

{#if isOpen}
	<Portal>
		<div class="floating-wrapper" bind:this={contentRef} use:floatingContent id={dropdownId}>
			<div
				class="drop-down-flyout"
				class:no-padding={noPadding}
				class:with-close-button={showCloseButton}
			>
				{#if showCloseButton}
					<button
						type="button"
						class="close-button"
						aria-label={closeButtonLabel}
						onclick={(event) => {
							event.stopPropagation();
							closeDropdown();
						}}
					>
						<Close />
					</button>
				{/if}
				{@render children()}
			</div>
		</div>
	</Portal>
{/if}

<style>
	.dropdown-trigger {
		display: flex;
		justify-content: center;
		align-items: stretch;

		&.stretch {
			width: 100%;
			justify-content: flex-start;

			> :global(*) {
				width: 100%;
			}
		}

		&.button-trigger {
			background-color: var(--color-bg-secondary);
			color: var(--color-text-primary);
			padding: 0.5rem 1rem;
			border-radius: var(--radius-md);
			font-weight: 500;
			line-height: 1.25rem;
			gap: 0.5rem;

			&:hover {
				background-color: var(--color-bg-secondary);
				filter: brightness(0.95);
			}

			&:active {
				transform: scale(0.95);
			}
		}

		&.filter-trigger {
			--filter-trigger-bg: var(--color-bg-surface);
			--filter-trigger-border-color: var(--color-border-primary);
			--filter-trigger-fg: var(--color-text-primary);

			height: calc(1.5rem + 0.5rem + 2px);
			background-color: var(--filter-trigger-bg);
			border-color: var(--filter-trigger-border-color);
			color: var(--filter-trigger-fg);
			transition:
				background-color 0.15s ease,
				border-color 0.15s ease,
				color 0.15s ease;

			&:hover {
				--filter-trigger-bg: var(--color-interactive-hover-bg);
			}

			&[aria-expanded='true'] {
				--filter-trigger-bg: var(--color-interactive-hover-bg);
			}

			&.active {
				--filter-trigger-bg: var(--color-interactive-active-bg);
				--filter-trigger-border-color: var(--color-interactive-active-bg);
				--filter-trigger-fg: var(--color-interactive-active-fg);
			}
		}
	}

	.trigger-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		&.filter {
			padding: 0.5rem 0.5rem;
			font-size: 0.875rem;
			min-width: 200px;
			justify-content: space-between;

			.label-text {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.chevron {
		display: flex;
		align-items: center;
		opacity: 0.7;
		flex-shrink: 0;
		pointer-events: none;
	}

	.chevron :global(svg) {
		pointer-events: none;
	}

	.floating-wrapper {
		z-index: 99999;
		width: max-content;
		max-width: min(44rem, var(--dropdown-available-width, calc(100vw - 1rem)));
	}

	.drop-down-flyout {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		border: 1px solid var(--color-border-secondary);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		max-width: 100%;
		max-height: min(85vh, var(--dropdown-available-height, calc(100dvh - 1rem)));
		overflow: auto;
		overscroll-behavior: contain;
		background-color: var(--color-bg-tertiary);
	}

	/* Section styling: each direct div child gets padding */
	.drop-down-flyout:not(.no-padding) :global(> div) {
		padding: 0.75rem 1rem;
	}

	/* Dividing border between sections */
	.drop-down-flyout:not(.no-padding) :global(> div + div) {
		border-top: 1px solid var(--color-border-secondary);
	}

	.close-button {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem;
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-pill);
		background-color: var(--color-bg-surface);
		color: var(--color-text-secondary);
		font-size: 1rem;
		line-height: 1;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.close-button:hover {
		border-color: var(--color-border-primary);
		background-color: var(--color-bg-subtle);
		color: var(--color-text-primary);
	}
</style>
