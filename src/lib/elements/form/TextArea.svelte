<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type Props = {
		id?: string | null;
		value: string | null | undefined;
	} & Omit<HTMLTextareaAttributes, 'id' | 'value'>;

	let { id, value = $bindable(), ...rest }: Props = $props();

	const labelId: string | undefined = getContext('field-id');
	const actualId = $derived(id !== undefined ? id : labelId);
</script>

<textarea id={actualId} bind:value {...rest}></textarea>

<style>
	textarea {
		color: var(--color-text-primary);
		background-color: var(--color-bg-surface);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border-primary);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
	}
</style>
