<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	// TODO: add support for suffix prop
	type Props = {
		id?: string | null;
		value: string | number | null | undefined;
	} & Omit<HTMLInputAttributes, 'id' | 'value'>;

	let { id, value = $bindable(), ...rest }: Props = $props();

	const labelId: string | undefined = getContext('field-id');
	const actualId = $derived(id !== undefined ? id : labelId);
</script>

<input id={actualId} bind:value {...rest} />

<style>
	input {
		color: var(--color-text-primary);
		background-color: var(--color-bg-surface);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		height: 2rem;
		box-sizing: border-box;
	}

	input:read-only {
		color: var(--color-text-muted);
		background-color: var(--color-bg-secondary);
		border-color: transparent;
		pointer-events: none;
	}
</style>
