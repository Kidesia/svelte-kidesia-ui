<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import CloseIcon from '~icons/material-symbols/close-rounded';
	import ExpandIcon from '~icons/material-symbols/open-in-new-rounded';

	import i18n from '$lib/i18n/index.svelte';
	import { type StorageLike, usePersistedState } from '$lib/utils/persisted-state.svelte';
	import { tooltip } from '$lib/utils/tooltip';

	import {
		PAGE_HEADER_CONTEXT,
		type PageHeader,
		type PageHeaderContext
	} from './app-shell-context';

	type Props = {
		title?: string;
		expandHref?: string;
		storageKey?: string;
		storage?: StorageLike;
		onClose: () => void;
		children: Snippet;
	};

	const { title, expandHref, storageKey, storage, onClose, children }: Props = $props();

	let drawerEl: HTMLDivElement | undefined = $state(undefined);

	// Overlays spawned from inside the drawer (dropdown flyouts, pickers) portal
	// into the drawer element, so they count as inside for the outside-click check.
	setContext('portal-target', () => drawerEl);

	// Capture phase: runs before the clicked element's own handler, so closing here
	// and letting the event continue means a click on another list row immediately
	// re-opens the drawer with the new item (the later navigation supersedes ours).
	// Clicks inside a modal stacked on top (e.g. the search palette) don't count.
	function handleDocumentClick(e: MouseEvent) {
		if (!drawerEl || !(e.target instanceof Element)) return;
		if (drawerEl.contains(e.target)) return;
		if (document.querySelector(':modal')) return;

		onClose();
	}

	const DEFAULT_WIDTH = 640;

	function useWidthState() {
		if (storageKey) {
			return usePersistedState(`drawer-width/${storageKey}`, DEFAULT_WIDTH, storage);
		}

		let value = $state(DEFAULT_WIDTH);
		return {
			get value() {
				return value;
			},
			set value(newValue: number) {
				value = newValue;
			}
		};
	}

	const width = useWidthState();

	let isResizing = $state(false);

	function clampWidth(value: number): number {
		const max = Math.min(window.innerWidth * 0.9, 1100);
		return Math.min(Math.max(value, 360), max);
	}

	function handleResizeStart(e: PointerEvent) {
		const handle = e.currentTarget as HTMLElement;
		const startX = e.clientX;
		const startWidth = width.value;

		handle.setPointerCapture(e.pointerId);
		isResizing = true;

		function handleMove(moveEvent: PointerEvent) {
			width.value = clampWidth(startWidth + (startX - moveEvent.clientX));
		}

		function handleUp() {
			isResizing = false;
			handle.removeEventListener('pointermove', handleMove);
			handle.removeEventListener('pointerup', handleUp);
			handle.removeEventListener('pointercancel', handleUp);
		}

		handle.addEventListener('pointermove', handleMove);
		handle.addEventListener('pointerup', handleUp);
		handle.addEventListener('pointercancel', handleUp);
	}

	function handleResizeKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			width.value = clampWidth(width.value + 24);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			width.value = clampWidth(width.value - 24);
		}
	}

	// Shadow the app topbar's page-header context: a Page rendered inside the
	// drawer registers its title here instead of replacing the topbar's.
	let pageHeaders = $state.raw<(() => PageHeader)[]>([]);

	setContext<PageHeaderContext>(PAGE_HEADER_CONTEXT, {
		register: (header) => {
			pageHeaders = [...pageHeaders, header];
			return () => {
				pageHeaders = pageHeaders.filter((h) => h !== header);
			};
		}
	});

	const pageHeader = $derived(pageHeaders.at(-1)?.());
	const headerTitle = $derived(pageHeader?.title ?? title);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;

		// The drawer is non-modal; leave Escape to any modal dialog stacked on top.
		if (document.querySelector(':modal')) return;

		onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />
<svelte:document onclickcapture={handleDocumentClick} />

<div
	bind:this={drawerEl}
	class="drawer"
	class:resizing={isResizing}
	role="dialog"
	aria-label={headerTitle}
	style:width={`min(${width.value}px, 100%)`}
	transition:fly={{ x: '100%', duration: 250 }}
>
	<!-- ARIA window-splitter pattern: a focusable separator is interactive by spec,
	     but the a11y linter only knows the static separator role. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="resize-handle"
		role="separator"
		aria-orientation="vertical"
		aria-label={i18n.t('common.resize')}
		aria-valuenow={Math.round(width.value)}
		tabindex="0"
		onpointerdown={handleResizeStart}
		onkeydown={handleResizeKeydown}
		ondblclick={() => {
			width.value = DEFAULT_WIDTH;
		}}
	></div>

	<header>
		{#if expandHref}
			<a
				class="header-title title-link"
				href={expandHref}
				{@attach tooltip(i18n.t('common.openFullPage'), 'bottom')}
			>
				<h2>{headerTitle}</h2>
				<span class="expand-icon" aria-hidden="true">
					<ExpandIcon />
				</span>
			</a>
		{:else}
			<div class="header-title">
				<h2>{headerTitle}</h2>
			</div>
		{/if}

		<button
			class="icon-button"
			aria-label={i18n.t('common.close')}
			onclick={() => {
				onClose();
			}}
		>
			<CloseIcon />
		</button>
	</header>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 150;
		background-color: var(--color-bg-surface);
		border-left: 1px solid var(--color-border-primary);
		box-shadow: var(--shadow-md);
		display: flex;
		flex-direction: column;
	}

	.drawer.resizing {
		user-select: none;
	}

	.resize-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -0.25rem;
		width: 0.5rem;
		cursor: col-resize;
		touch-action: none;
		z-index: 1;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			left: calc(50% - 1.5px);
			width: 3px;
			background-color: var(--color-primary);
			opacity: 0;
			transition: opacity 0.15s ease;
		}

		&:hover::after,
		&:focus-visible::after {
			opacity: 0.5;
		}
	}

	.drawer.resizing .resize-handle::after {
		opacity: 1;
	}

	header {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		min-height: 4rem;
		padding: 0.5rem 1rem 0.5rem 1.5rem;
		border-bottom: 1px solid var(--color-border-primary);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		min-width: 0;
	}

	.title-link {
		padding: 0.25rem 0.625rem;
		margin-left: -0.625rem;
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: var(--color-interactive-hover-bg);
		}
	}

	.expand-icon {
		display: inline-flex;
		flex-shrink: 0;
		margin-left: 0.25rem;
		color: var(--color-text-secondary);

		:global(svg) {
			width: 1.125rem;
			height: 1.125rem;
		}
	}

	h2 {
		min-width: 0;
		font-size: 1.2rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--color-text-primary);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.icon-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		border-radius: var(--radius-pill);
		background: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: var(--color-interactive-hover-bg);
		}

		:global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}
	}

	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 1rem 1.5rem 1.5rem;
		background-color: var(--color-bg-inset);
	}
</style>
