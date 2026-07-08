<script lang="ts">
	import { tooltip } from '$lib/utils/tooltip';

	type Props = {
		firstName?: string | null;
		lastName?: string | null;
		name?: string | null;
		size?: 'small' | 'medium' | 'large';
		status?: { color: string; label?: string };
	};

	const { firstName = '', lastName = '', name, size = 'medium', status }: Props = $props();

	const initials = $derived.by(() => {
		if (firstName || lastName) {
			return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase();
		}
		if (name) {
			const parts = name.trim().split(/\s+/);
			return ((parts[0]?.charAt(0) ?? '') + (parts[1]?.charAt(0) ?? '')).toUpperCase();
		}
		return '';
	});

	// Deterministic, calm hue derived from the name (matches the Card icon styling).
	const hue = $derived.by(() => {
		const source = name ?? `${firstName ?? ''} ${lastName ?? ''}`;
		let hash = 0;
		for (let i = 0; i < source.length; i++) {
			hash = source.charCodeAt(i) + ((hash << 5) - hash);
		}
		return Math.abs(hash) % 360;
	});
</script>

<div class="avatar size-{size}" style="--hue: {hue}" title={name ?? `${firstName} ${lastName}`}>
	{initials}
	{#if status}
		<span
			class="status-dot"
			style="background-color: {status.color}"
			{@attach status.label ? tooltip(status.label) : null}
		></span>
	{/if}
</div>

<style>
	.avatar {
		position: relative;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-weight: 600;
		line-height: 1;
		background-color: oklch(var(--tint-soft-bg) var(--hue));
		color: oklch(var(--tint-soft-fg) var(--hue));
	}

	:global(.dark-mode) .avatar {
		background-color: oklch(var(--tint-strong-bg) var(--hue));
		color: oklch(var(--tint-strong-fg) var(--hue));
	}

	.size-small {
		width: 1.75rem;
		height: 1.75rem;
		font-size: 0.7rem;
	}

	.size-medium {
		width: 2.25rem;
		height: 2.25rem;
		font-size: 0.8rem;
	}

	.size-large {
		width: 3rem;
		height: 3rem;
		font-size: 1rem;
	}

	.status-dot {
		position: absolute;
		right: -0.05rem;
		bottom: -0.05rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 2px solid var(--color-bg-surface);
	}

	.size-small .status-dot {
		width: 0.6rem;
		height: 0.6rem;
	}
</style>
