<script lang="ts" generics="T extends string | number | boolean">
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Option<T> = {
		value: T;
		label: string;
	};

	type Props = {
		id?: string | null;
		name: string;
		value: T | null | undefined;
		options: Option<T>[];
		disabled?: boolean;
	} & Omit<HTMLInputAttributes, 'id' | 'name' | 'value' | 'type' | 'disabled'>;

	let { id, name, value = $bindable(), options, disabled = false, ...rest }: Props = $props();

	const labelId: string | undefined = getContext('field-id');
	const actualId = $derived(id !== undefined ? id : labelId);

	function handleChange(optionValue: T) {
		value = optionValue;
	}
</script>

<div class="radio-group" id={actualId}>
	{#each options as option (option.value)}
		<label class="radio-option">
			<input
				type="radio"
				{name}
				value={option.value}
				checked={value === option.value}
				{disabled}
				onchange={() => {
					handleChange(option.value);
				}}
				{...rest}
			/>
			<span class="radio-box"></span>
			<span class="radio-text">{option.label}</span>
		</label>
	{/each}
</div>

<style>
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-primary);
		cursor: pointer;
		font-size: 0.875rem;
		width: fit-content;
	}

	.radio-option:has(input:disabled) {
		opacity: 0.5;
		cursor: default;
	}

	input[type='radio'] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.radio-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border: 1.5px solid var(--color-border-secondary);
		border-radius: 50%;
		background-color: var(--color-bg-surface);
		flex-shrink: 0;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.radio-box::after {
		content: '';
		display: block;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: transparent;
		transition: background-color 0.15s ease;
	}

	input:checked + .radio-box {
		border-color: var(--color-primary);
	}

	input:checked + .radio-box::after {
		background-color: var(--color-primary);
	}

	.radio-option:hover .radio-box {
		border-color: var(--color-primary);
	}

	input:focus-visible + .radio-box {
		outline: var(--focus-ring);
		outline-offset: 2px;
	}

	.radio-text {
		user-select: none;
	}
</style>
