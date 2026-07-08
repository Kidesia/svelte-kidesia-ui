<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		text: string;
		required?: boolean;
		errors?: string[];
		align?: 'left' | 'right' | 'stretch';
		value?: string | null;
		children?: Snippet;
	};

	const { text, required, errors, align = 'left', value, children }: Props = $props();

	const requiredMarker = $derived(required ? '*' : '');
</script>

<label class:error={errors} class="align-{align}">
	<span class="label-text">{text}{requiredMarker}</span>
	{#if children}
		{@render children()}
	{:else if value && value.length > 0}
		{value}
	{:else}
		-
	{/if}

	{#each errors ?? [] as error (error)}
		<small>{error}</small>
	{/each}
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		.label-text {
			font-size: 0.9rem;
			color: var(--color-text-secondary);
			flex-shrink: 0;
		}

		small {
			font-size: 0.9em;
			color: var(--color-error-text);
			margin-left: 0.5rem;
		}

		&.align-left {
			align-items: stretch;
		}

		&.align-right {
			align-items: flex-end;
		}

		&.align-stretch {
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;
		}
	}
</style>
