<script lang="ts">
	import type { Component } from 'svelte';

	import iconsRegistry from '$lib/utils/icons-registry';

	type Props = {
		label: string;
		icon?: Component | keyof typeof iconsRegistry;
		checked?: boolean | null;
		disabled?: boolean;
		onChange?: (checked: boolean) => void;
	};

	let { label, icon, checked = $bindable(false), disabled = false, onChange }: Props = $props();

	const Icon = $derived(icon && typeof icon === 'string' ? iconsRegistry[icon].outline : icon);
	const CheckIcon = iconsRegistry['done'].outline;

	function toggleChecked() {
		if (!disabled) {
			checked = !checked;
			onChange?.(checked ?? false);
		}
	}
</script>

<label class="tight-focus-within" class:disabled class:checked>
	<input type="checkbox" {disabled} {checked} onclick={toggleChecked} />
	<span class="icon" class:active={checked} class:custom-icon={!!icon}>
		{#if Icon}
			<Icon />
		{:else}
			<CheckIcon />
		{/if}
	</span>
	<span class="label">{label}</span>
</label>

<style>
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: fit-content;
		padding: 0.25rem 0.75rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 1rem;
		color: var(--color-text-primary);
		user-select: none;
		font-size: 0.9rem;
		cursor: pointer;

		&:hover:not(.disabled) {
			background-color: var(--color-interactive-hover);
		}

		&.checked {
			background-color: var(--color-primary-subtle);
			border-color: var(--color-primary);
			color: var(--color-on-primary-subtle);
		}

		&.disabled {
			opacity: 0.5;
			cursor: unset;
		}
	}

	input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.icon {
		display: none;
		align-items: center;
		width: 1rem;
		height: 1rem;
		font-size: 1rem;
		line-height: 1;

		&.custom-icon {
			display: flex;
			opacity: 0.6;
		}

		&.active {
			display: flex;
			opacity: 1;
		}
	}
</style>
