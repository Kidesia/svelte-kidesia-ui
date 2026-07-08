<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	type Props = {
		id?: string | null;
		value: unknown;
		children: Snippet;
	} & Omit<HTMLSelectAttributes, 'id' | 'value'>;

	let { id, value = $bindable(), children, ...rest }: Props = $props();

	const labelId: string | undefined = getContext('field-id');
	const actualId = $derived(id !== undefined ? id : labelId);
</script>

<select id={actualId} bind:value {...rest}>
	{@render children()}
</select>

<style>
	select {
		color: var(--color-text-primary);
		background-color: var(--color-bg-surface);
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-border-primary);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		appearance: none;
		background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1em;
		padding-right: 2.5rem;
	}
</style>
