<script lang="ts">
	type Props = {
		count: number;
		label: string;
	};

	const { count, label }: Props = $props();
</script>

<div class="count-pill" aria-label={`${count} ${label}`}>
	<span class="count-number">{count}</span>
	<span class="count-label">{label}</span>
</div>

<style>
	.count-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		background-color: var(--color-bg-subtle);
		color: var(--color-text-secondary);
		font-size: 0.85rem;
		line-height: 1;
	}

	.count-number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.6rem;
		height: 1.6rem;
		padding: 0 0.4rem;
		border-radius: 999px;
		background-color: var(--color-bg-surface);
		color: var(--color-text-primary);
		font-weight: 700;
	}

	.count-label {
		font-weight: 500;
	}
</style>
