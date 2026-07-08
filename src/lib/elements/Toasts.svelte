<script module lang="ts">
	export type ToastVariant = 'error' | 'info' | 'warning';

	type Toast = {
		id: number;
		message: string;
		variant: ToastVariant;
	};

	const AUTO_DISMISS_MS = 5000;

	let toasts = $state<Toast[]>([]);
	let nextId = 0;
	const timers = new Map<number, ReturnType<typeof setTimeout>>();

	export function addToast(input: { message: string; variant?: ToastVariant }): number {
		const id = ++nextId;
		const variant = input.variant ?? 'info';
		toasts.push({ id, message: input.message, variant });
		timers.set(
			id,
			setTimeout(() => dismissToast(id), AUTO_DISMISS_MS)
		);
		return id;
	}

	export function dismissToast(id: number) {
		const timer = timers.get(id);
		if (timer !== undefined) {
			clearTimeout(timer);
			timers.delete(id);
		}
		const index = toasts.findIndex((t) => t.id === id);
		if (index !== -1) toasts.splice(index, 1);
	}
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import CloseIcon from '~icons/material-symbols/close-rounded';

	import i18n from '$lib/i18n/index.svelte';
</script>

<div class="toasts" role="status" aria-live="polite">
	{#each toasts as toast (toast.id)}
		<div class={`toast toast-${toast.variant}`} transition:fly={{ y: 16, duration: 180 }}>
			<span class="toast-message">{toast.message}</span>
			<button
				type="button"
				class="toast-close"
				aria-label={i18n.t('common.dismiss')}
				onclick={() => dismissToast(toast.id)}
			>
				<CloseIcon />
			</button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 10000;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: min(24rem, calc(100vw - 2rem));
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.6rem 0.75rem 0.6rem 1rem;
		border-radius: 0.5rem;
		box-shadow:
			0 4px 16px oklch(0% 0 0 / 18%),
			0 1px 4px oklch(0% 0 0 / 10%);
		pointer-events: auto;
	}

	.toast-info {
		background-color: var(--color-info-surface);
		border: 1px solid var(--color-info-border);
		color: var(--color-info-surface-text);
	}

	.toast-error {
		background-color: var(--color-error-surface);
		border: 1px solid var(--color-error-border);
		color: var(--color-error-surface-text);
	}

	.toast-warning {
		background-color: var(--color-warning-surface);
		border: 1px solid var(--color-warning-border);
		color: var(--color-warning-text);
	}

	.toast-message {
		flex: 1;
		font-size: 0.875rem;
		line-height: 1.35;
	}

	.toast-close {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
		border: none;
		background: transparent;
		border-radius: 0.25rem;
		color: inherit;
		cursor: pointer;
		opacity: 0.75;
	}

	.toast-close:hover {
		opacity: 1;
		background-color: oklch(0% 0 0 / 8%);
	}
</style>
