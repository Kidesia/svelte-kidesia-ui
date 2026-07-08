<script lang="ts">
	import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { getContext } from 'svelte';
	import CloseSmall from '~icons/material-symbols/close-small-rounded';
	import ExpandLess from '~icons/material-symbols/expand-less-rounded';
	import ExpandMore from '~icons/material-symbols/expand-more-rounded';

	import SearchInput from './SearchInput.svelte';

	type Item = {
		id: number;
		label: string;
	};

	type Props = {
		items: Item[];
		value: number[];
		addLabel: string;
		removeLabel: string;
		emptyLabel: string;
		searchPlaceholder?: string;
		disabled?: boolean;
	};

	let {
		items,
		value = $bindable(),
		addLabel,
		removeLabel,
		emptyLabel,
		searchPlaceholder,
		disabled = false
	}: Props = $props();

	const labelId: string | undefined = getContext('field-id');
	const listboxId = `multi-combobox-${Math.random().toString(36).slice(2, 11)}`;

	let search = $state('');
	let isOpen = $state(false);
	let activeIndex = $state(-1);

	let triggerRef = $state<HTMLButtonElement>();
	let overlayRef = $state<HTMLDivElement>();
	let containerRef = $state<HTMLDivElement>();

	const selectedItems = $derived.by(() => {
		const itemsById = new Map(items.map((item) => [item.id, item]));

		return value.flatMap((itemId) => {
			const item = itemsById.get(itemId);

			return item ? [item] : [];
		});
	});
	const availableItems = $derived(items.filter((item) => !value.includes(item.id)));
	const filteredItems = $derived.by(() => {
		const searchTerm = search.trim().toLowerCase();

		return availableItems.filter((item) => item.label.toLowerCase().includes(searchTerm));
	});

	function getUniqueValue(nextValue: number[]) {
		return [...new Set(nextValue)];
	}

	function setValue(nextValue: number[]) {
		value = getUniqueValue(nextValue);
	}

	function addItem(itemId: number) {
		if (value.includes(itemId)) return;

		const nextValue = [...value, itemId];

		setValue(nextValue);
		search = '';

		if (nextValue.length === items.length) {
			isOpen = false;
			triggerRef?.focus();
			return;
		}

		activeIndex = 0;
		requestAnimationFrame(() => overlayRef?.querySelector<HTMLInputElement>('input')?.focus());
	}

	function removeItem(itemId: number) {
		setValue(value.filter((id) => id !== itemId));
	}

	function handleTriggerKeyDown(e: KeyboardEvent) {
		if (disabled) return;

		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			isOpen = true;
		}
	}

	function handlePickerKeyDown(e: KeyboardEvent) {
		if (filteredItems.length === 0) {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				isOpen = false;
				triggerRef?.focus();
			}

			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % filteredItems.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();

			if (activeIndex !== -1 && filteredItems[activeIndex]) {
				addItem(filteredItems[activeIndex].id);
			}
		} else if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			isOpen = false;
			triggerRef?.focus();
		}
	}

	function handleFocusOut(e: FocusEvent) {
		if (containerRef && !containerRef.contains(e.relatedTarget as Node)) {
			isOpen = false;
		}
	}

	function handleOutsideClick(e: MouseEvent) {
		if (isOpen && !containerRef?.contains(e.target as Node)) {
			isOpen = false;
		}
	}

	$effect(() => {
		const uniqueValue = getUniqueValue(value);

		if (uniqueValue.length !== value.length) {
			value = uniqueValue;
		}
	});

	$effect(() => {
		if (isOpen && triggerRef && overlayRef) {
			const cleanup = autoUpdate(triggerRef, overlayRef, async () => {
				if (!triggerRef || !overlayRef) return;

				const { x, y } = await computePosition(triggerRef, overlayRef, {
					placement: 'bottom-start',
					middleware: [offset(8), flip(), shift({ padding: 10 })]
				});

				Object.assign(overlayRef.style, {
					left: `${x}px`,
					top: `${y}px`,
					width: `${triggerRef.getBoundingClientRect().width}px`
				});
			});

			return cleanup;
		}

		return undefined;
	});

	$effect(() => {
		if (isOpen) {
			search = '';
			requestAnimationFrame(() => overlayRef?.querySelector<HTMLInputElement>('input')?.focus());
		}
	});

	$effect(() => {
		if (!isOpen) return;

		activeIndex =
			filteredItems.length > 0 ? Math.min(Math.max(activeIndex, 0), filteredItems.length - 1) : -1;
	});

	$effect(() => {
		if (isOpen && activeIndex !== -1) {
			document.getElementById(`${listboxId}-opt-${activeIndex}`)?.scrollIntoView({
				block: 'nearest'
			});
		}
	});
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="multi-combobox" bind:this={containerRef} onfocusout={handleFocusOut}>
	{#if selectedItems.length > 0}
		<div class="selected-chips">
			{#each selectedItems as item (item.id)}
				<span class="selected-chip">
					<span>{item.label}</span>
					<button
						type="button"
						class="remove-chip"
						aria-label={`${removeLabel}: ${item.label}`}
						onclick={() => removeItem(item.id)}
					>
						<CloseSmall />
					</button>
				</span>
			{/each}
		</div>
	{/if}

	<button
		id={labelId}
		type="button"
		bind:this={triggerRef}
		class="trigger control-surface"
		class:active={isOpen}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-controls={isOpen ? listboxId : undefined}
		disabled={disabled || availableItems.length === 0}
		onclick={() => {
			isOpen = !isOpen;
		}}
		onkeydown={handleTriggerKeyDown}
	>
		<span>{addLabel}</span>
		<span class="chevron" aria-hidden="true">
			{#if isOpen}<ExpandLess />{:else}<ExpandMore />{/if}
		</span>
	</button>

	{#if isOpen}
		<div
			bind:this={overlayRef}
			class="dropdown-overlay"
			role="none"
			onkeydown={handlePickerKeyDown}
			onmousedown={(e) => e.preventDefault()}
		>
			<div class="search-container">
				<SearchInput bind:value={search} placeholder={searchPlaceholder} />
			</div>

			<ul id={listboxId} role="listbox">
				{#each filteredItems as item, i (item.id)}
					<li
						id={`${listboxId}-opt-${i}`}
						role="option"
						aria-selected={activeIndex === i}
						tabindex="-1"
						class:highlighted={activeIndex === i}
						onmousedown={(e) => {
							e.preventDefault();
							addItem(item.id);
						}}
						onclick={() => addItem(item.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								addItem(item.id);
							}
						}}
						onmouseenter={() => {
							activeIndex = i;
						}}
					>
						{item.label}
					</li>
				{:else}
					<li class="empty-state" role="presentation">{emptyLabel}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.multi-combobox {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.selected-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.selected-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.35rem 0.25rem 0.75rem;
		border-radius: var(--radius-pill);
		background-color: var(--color-primary-subtle);
		border: 1px solid var(--color-primary);
		color: var(--color-on-primary-subtle);
		font-size: 0.9rem;
	}

	.remove-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.15rem;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		color: inherit;
		font-size: 0.875rem;
		line-height: 1;
		cursor: pointer;
	}

	.remove-chip:hover {
		background-color: var(--color-interactive-hover);
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		text-align: left;
	}

	.trigger.active:not(:focus-visible) {
		border-color: var(--color-primary);
	}

	.trigger:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.chevron {
		display: flex;
		align-items: center;
		opacity: 0.7;
		flex-shrink: 0;
	}

	.dropdown-overlay {
		position: fixed;
		z-index: 1000;
		background: var(--color-bg-surface);
		border: 1px solid var(--color-border-primary);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		min-width: 240px;
		display: flex;
		flex-direction: column;
		max-width: min(28rem, calc(100vw - 2rem));
	}

	.search-container {
		padding: 0.75rem;
		border-bottom: 1px solid var(--color-border-primary);
	}

	.search-container :global(.search-input-wrapper input) {
		width: 100%;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0.25rem;
		max-height: 18rem;
		overflow-y: auto;
	}

	li {
		padding: 0.625rem 0.75rem;
		cursor: pointer;
		border-radius: var(--radius-sm);
	}

	li.highlighted {
		background-color: var(--color-bg-subtle);
	}

	.empty-state {
		color: var(--color-text-muted);
		font-style: italic;
		cursor: default;
	}

	.empty-state:hover {
		background: transparent;
		color: var(--color-text-muted);
	}
</style>
