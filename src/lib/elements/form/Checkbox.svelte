<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		checked: boolean | null | undefined;
		label?: string;
		description?: string;
		children?: Snippet;
	} & Omit<HTMLInputAttributes, 'checked' | 'type'>;

	let { checked = $bindable(), label, description, children, ...rest }: Props = $props();
</script>

<label class="checkbox-label">
	<input type="checkbox" bind:checked {...rest} />
	<span class="checkbox-box"></span>
	{#if children}
		{@render children()}
	{:else if description}
		<div class="checkbox-text">
			<span>{label}</span>
			<span class="description">{description}</span>
		</div>
	{:else if label}
		<span class="checkbox-text">{label}</span>
	{/if}
</label>

<style>
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text-primary);
		width: fit-content;
		cursor: pointer;
		font-size: 0.875rem;
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

	.checkbox-box {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
		border: 1.5px solid var(--color-border-secondary);
		border-radius: var(--radius-xs);
		background-color: var(--color-bg-surface);
		flex-shrink: 0;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.checkbox-box::after {
		content: '';
		display: block;
		width: 0.35rem;
		height: 0.6rem;
		border: solid transparent;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg) translateY(-1px);
		transition: border-color 0.15s ease;
	}

	input:checked + .checkbox-box {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}

	input:checked + .checkbox-box::after {
		border-color: var(--color-primary-fg);
	}

	.checkbox-label:hover .checkbox-box {
		border-color: var(--color-primary);
	}

	input:focus-visible + .checkbox-box {
		outline: var(--focus-ring);
		outline-offset: 2px;
	}

	input:disabled + .checkbox-box {
		opacity: 0.5;
		cursor: default;
	}

	input:disabled ~ .checkbox-text {
		opacity: 0.5;
	}

	.checkbox-label:has(input:disabled) {
		cursor: default;
		opacity: 0.5;
	}

	.checkbox-text {
		user-select: none;
	}

	.description {
		color: var(--color-text-muted);
		white-space: break-spaces;
	}

	.checkbox-text:has(.description) {
		display: flex;
		flex-direction: column;
	}
</style>
