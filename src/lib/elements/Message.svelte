<script lang="ts">
	type Props = {
		text: string;
		type?: 'info' | 'error' | 'warning';
	};

	const { text, type = 'info' }: Props = $props();

	const paragraphs = $derived(text.split('\n'));
</script>

<div class={`message message-${type}`}>
	{#each paragraphs as paragraph, i (i)}
		<p>{paragraph}</p>
	{/each}
</div>

<style>
	.message {
		width: 100%;
		padding: 0.6rem 1rem;
		border-radius: var(--radius-md);
	}

	.message-info {
		background-color: var(--color-info-surface);
		border: 1px solid var(--color-info-border);
		color: var(--color-info-surface-text);
	}

	.message-error {
		background-color: var(--color-error-surface);
		border: 1px solid var(--color-error-border);
		color: var(--color-error-surface-text);
	}

	.message-warning {
		background-color: var(--color-warning-surface);
		border: 1px solid var(--color-warning-border);
		color: var(--color-warning-text);
	}

	p {
		max-width: 80ch;
	}
</style>
