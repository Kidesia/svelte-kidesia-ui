<script lang="ts">
	import { computePosition, flip, offset, type Placement, shift } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	import Portal from './Portal.svelte';

	type Props = {
		children: Snippet;
		tooltip?: Snippet;
		placement?: Placement;
	};

	let { children, tooltip, placement = 'top' }: Props = $props();

	let triggerEl = $state<HTMLElement | undefined>(undefined);
	let floatingEl = $state<HTMLElement | undefined>(undefined);
	let isOpen = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	function updatePosition() {
		// With display:contents the wrapper has no box — use the first child as reference
		const reference = (triggerEl?.firstElementChild ?? triggerEl) as HTMLElement | null;
		if (!reference || !floatingEl) return;
		computePosition(reference, floatingEl, {
			placement,
			middleware: [offset(6), flip(), shift({ padding: 5 })]
		}).then(({ x, y }) => {
			if (!floatingEl) return;
			Object.assign(floatingEl.style, { left: `${x}px`, top: `${y}px` });
		});
	}

	$effect(() => {
		if (isOpen && floatingEl) {
			updatePosition();
		}
	});

	let autoHideTimeout: ReturnType<typeof setTimeout> | undefined;

	function show() {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			isOpen = true;
		}, 400);
	}

	function hide() {
		clearTimeout(timeout);
		clearTimeout(autoHideTimeout);
		timeout = setTimeout(() => {
			isOpen = false;
		}, 150);
	}

	function cancelHide() {
		clearTimeout(timeout);
	}

	function onTouchStart(_e: TouchEvent) {
		if (isOpen) {
			clearTimeout(autoHideTimeout);
			isOpen = false;
		} else {
			clearTimeout(timeout);
			isOpen = true;
			// Auto-dismiss after 3 seconds on touch
			autoHideTimeout = setTimeout(() => {
				isOpen = false;
			}, 3000);
		}
	}

	// Dismiss tooltip when tapping outside on touch devices
	function onDocumentTouch(e: TouchEvent) {
		if (isOpen && triggerEl && !triggerEl.contains(e.target as Node)) {
			clearTimeout(timeout);
			clearTimeout(autoHideTimeout);
			isOpen = false;
		}
	}

	$effect(() => {
		document.addEventListener('touchstart', onDocumentTouch, { passive: true });
		return () => {
			document.removeEventListener('touchstart', onDocumentTouch);
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	style="display: contents"
	bind:this={triggerEl}
	onmouseenter={show}
	onmouseleave={hide}
	onfocusin={show}
	onfocusout={hide}
	ontouchstart={onTouchStart}
>
	{@render children()}
</div>

{#if isOpen && tooltip}
	<Portal>
		<div
			bind:this={floatingEl}
			class="floating-container"
			style="position: absolute; top: 0; left: 0;"
			onmouseenter={cancelHide}
			onmouseleave={hide}
			in:fade={{ duration: 150 }}
			out:fade={{ duration: 100 }}
			role="tooltip"
		>
			{@render tooltip()}
		</div>
	</Portal>
{/if}

<style>
	.floating-container {
		border: 1px solid var(--color-border-primary);
		background-color: var(--color-bg-surface);
		backdrop-filter: blur(8px);
		border-radius: var(--radius-md);
		z-index: 9999;
		box-shadow: var(--shadow-md);
		overflow: auto;
		pointer-events: all;
	}
</style>
