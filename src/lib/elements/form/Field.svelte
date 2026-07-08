<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	type Props = {
		/* The label text */
		label: string;
		/* Optional flag to render as a fieldset group */
		asGroup?: true;
		/* Optional flag to mark as required */
		required?: boolean;
		/* Optional list of errors */
		errors?: string[];
		/* Child content to render inside the label */
		children: Snippet;
	};

	const { label, required, asGroup, errors, children }: Props = $props();

	const id = `id-${Math.random().toString(36).slice(2, 9)}`;

	const error = $derived(errors?.join(', '));

	// The label provides an id which the form element has to reference for accessibility
	setContext('field-id', id);
</script>

{#if asGroup}
	<fieldset class="label">
		<legend>{label}{required ? '*' : ''}</legend>
		{@render children()}
		{#if error}
			<div class="error" transition:slide>{error}</div>
		{/if}
	</fieldset>
{:else}
	<div class="label">
		<label for={id}>{label}{required ? '*' : ''}</label>
		{@render children()}
		{#if error}
			<div class="error" transition:slide>{error}</div>
		{/if}
	</div>
{/if}

<style>
	.label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		label,
		legend {
			margin-bottom: 0.25rem;
			font-size: 0.9rem;
			font-weight: 600;
			user-select: none;
			width: fit-content;
			color: var(--color-text-muted);
		}
	}

	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		padding-top: 0.5rem;
	}

	.error {
		color: var(--color-error-text);
		font-size: 0.875rem;
	}
</style>
