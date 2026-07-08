<script lang="ts">
	import CloseSmall from '~icons/material-symbols/close-small-rounded';
	import SearchIcon from '~icons/material-symbols/search-rounded';

	import i18n from '$lib/i18n/index.svelte';

	type Props = {
		value: string;
		placeholder?: string;
		debounceMs?: number;
	};

	let { value = $bindable(''), placeholder, debounceMs = 150 }: Props = $props();

	let localValue = $derived(value);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function handleInput(e: Event) {
		const newValue = (e.target as HTMLInputElement).value;
		localValue = newValue;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			value = newValue;
		}, debounceMs);
	}

	const actualPlaceholder = $derived(placeholder ?? i18n.t('common.search'));
	const active = $derived(localValue.trim() !== '');

	function clear() {
		clearTimeout(debounceTimer);
		localValue = '';
		value = '';
	}
</script>

<div class="search-input-wrapper" class:active>
	<span class="search-icon" aria-hidden="true">
		<SearchIcon />
	</span>
	<input
		type="text"
		value={localValue}
		oninput={handleInput}
		placeholder={actualPlaceholder}
		aria-label={actualPlaceholder}
	/>
	{#if localValue}
		<button type="button" class="clear-button" onclick={clear} aria-label={i18n.t('common.clear')}>
			<CloseSmall />
		</button>
	{/if}
</div>

<style>
	.search-input-wrapper {
		--search-input-bg: var(--color-bg-surface);
		--search-input-border-color: var(--color-border-primary);
		--search-icon-color: var(--color-text-muted);
		--search-clear-color: var(--color-text-muted);
		--search-clear-hover-color: var(--color-text-primary);

		position: relative;
		display: flex;
		align-items: center;
		width: fit-content;

		&.active {
			--search-input-bg: var(--color-interactive-active-bg);
			--search-input-border-color: var(--color-interactive-active-bg);
			--search-icon-color: var(--color-icon-active);
			--search-clear-color: var(--color-interactive-active-fg);
			--search-clear-hover-color: var(--color-interactive-active-fg);
		}
	}

	.search-input-wrapper input {
		flex: 1;
		color: var(--color-text-primary);
		background-color: var(--search-input-bg);
		padding: 0.5rem 2rem;
		height: calc(1.5rem + 0.5rem + 2px);
		border: 1px solid var(--search-input-border-color);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		min-width: 0;
		width: 140px;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.search-icon {
		position: absolute;
		left: 0.375rem;
		display: flex;
		align-items: center;
		color: var(--search-icon-color);
		pointer-events: none;
		font-size: 1.125rem;
		transition: color 0.15s ease;
	}

	.clear-button {
		position: absolute;
		right: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.125rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--search-clear-color);
		transition: color 0.15s ease;
		font-size: 1.25rem;
	}

	.clear-button:hover {
		color: var(--search-clear-hover-color);
	}
</style>
