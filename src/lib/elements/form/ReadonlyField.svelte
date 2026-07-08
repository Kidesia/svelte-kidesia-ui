<script lang="ts">
	type Props = {
		/* The label text */
		label: string;
		/* The value to display */
		value: string | number | null | undefined;
	};

	const { label, value }: Props = $props();
</script>

<div class="readonly-value">
	<div class="label">{label}</div>
	<div class="value">{value ?? '-'}</div>
</div>

<style>
	.readonly-value {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.9rem;
		font-weight: 600;
		user-select: none;
		width: fit-content;
		color: var(--color-text-muted);
	}
</style>
