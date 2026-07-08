<script lang="ts" generics="T extends { id: number | null; label: string }">
	import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import { getContext, type Snippet } from 'svelte';
	import CloseSmall from '~icons/material-symbols/close-small-rounded';
	import ExpandLess from '~icons/material-symbols/expand-less-rounded';
	import ExpandMore from '~icons/material-symbols/expand-more-rounded';

	import i18n from '$lib/i18n/index.svelte';

	type BaseProps = {
		items: T[];
		placeholder?: string;
		searchPlaceholder?: string;
		allowFilter?: boolean;
		itemComponent?: Snippet<[T]>;
	};

	type NullableProps = BaseProps & {
		required?: false;
		value: number | null;
		onChange?: (value: number | null) => void;
	};

	type RequiredProps = BaseProps & {
		required: true;
		value: number;
		onChange?: (value: number) => void;
	};

	type Props = NullableProps | RequiredProps;

	let {
		value = $bindable(),
		items = [],
		placeholder = i18n.t('common.selectOption'),
		searchPlaceholder = i18n.t('common.search'),
		allowFilter = true,
		itemComponent,
		onChange,
		required = false
	}: Props = $props();

	let isOpen = $state(false);
	let searchTerm = $state('');
	let activeIndex = $state(-1);

	let triggerRef = $state<HTMLButtonElement>();
	let overlayRef = $state<HTMLDivElement>();
	let searchInputRef = $state<HTMLInputElement>();
	let containerRef = $state<HTMLDivElement>();

	let selectedItem = $derived(items.find((i) => i.id === value));
	let filteredItems = $derived(
		items.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const labelId: string | undefined = getContext('field-id');

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
		// Focus input when opening
		if (isOpen) {
			searchTerm = '';
			const index = items.findIndex((i) => i.id === value);
			activeIndex = index;
			requestAnimationFrame(() => searchInputRef?.focus());
		}
	});

	$effect(() => {
		if (isOpen && activeIndex !== -1) {
			// Scroll active item into view (for keyboard navigation)
			document.getElementById(`opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
		}
	});

	function selectItem(item: T) {
		if (!isOpen) return;
		if (required && item.id === null) return;
		value = item.id as typeof value;
		(onChange as ((v: number | null) => void) | undefined)?.(item.id);
		triggerRef?.focus();
		isOpen = false;
	}

	function clearSelection(e: MouseEvent) {
		e.stopPropagation();
		value = null as typeof value;
		(onChange as ((v: number | null) => void) | undefined)?.(null);
		triggerRef?.focus();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			activeIndex = (activeIndex + 1) % filteredItems.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			activeIndex = (activeIndex - 1 + filteredItems.length) % filteredItems.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (activeIndex !== -1 && filteredItems[activeIndex]) {
				selectItem(filteredItems[activeIndex]);
			}
		} else if (e.key === 'Escape') {
			isOpen = false;
			triggerRef?.focus();
		}
	}

	function handleTriggerKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			isOpen = true;
		}
	}

	function handleFocusOut(e: FocusEvent) {
		// relatedTarget is the element receiving focus.
		// If it's outside our containerRef, the user has "left" the component.
		if (containerRef && !containerRef.contains(e.relatedTarget as Node)) {
			isOpen = false;
		}
	}

	function handleOutsideClick(e: MouseEvent) {
		if (isOpen && !containerRef?.contains(e.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="combobox-wrapper" bind:this={containerRef} onfocusout={handleFocusOut}>
	<button
		id={labelId}
		type="button"
		bind:this={triggerRef}
		class="trigger control-surface"
		class:active={isOpen}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
		onkeydown={handleTriggerKeyDown}
	>
		<div class="trigger-content">
			{#if selectedItem}
				{#if itemComponent}
					{@render itemComponent(selectedItem)}
				{:else}
					{selectedItem.label}
				{/if}
			{:else}
				<span class="placeholder">{placeholder}</span>
			{/if}
		</div>
		{#if !required && selectedItem}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<span
				class="clear-btn"
				role="button"
				tabindex="-1"
				aria-label="Clear"
				onclick={clearSelection}
			>
				<CloseSmall />
			</span>
		{:else}
			<span class="chevron" aria-hidden="true">
				{#if isOpen}<ExpandLess />{:else}<ExpandMore />{/if}
			</span>
		{/if}
	</button>

	{#if isOpen}
		<div
			bind:this={overlayRef}
			class="dropdown-overlay"
			role="none"
			onmousedown={(e) => e.preventDefault()}
		>
			{#if allowFilter}
				<div class="search-container">
					<input
						bind:this={searchInputRef}
						type="text"
						role="combobox"
						aria-autocomplete="list"
						aria-expanded="true"
						aria-controls="listbox-id"
						aria-activedescendant={activeIndex !== -1 ? `opt-${activeIndex}` : undefined}
						placeholder={searchPlaceholder}
						bind:value={searchTerm}
						onkeydown={handleKeyDown}
						autocomplete="off"
					/>
				</div>
			{/if}

			<ul role="listbox" id="listbox-id">
				{#each filteredItems as item, i (item.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						id="opt-{i}"
						role="option"
						aria-selected={activeIndex === i}
						class:highlighted={activeIndex === i}
						class:selected={value === item.id}
						onmousedown={(e) => {
							e.preventDefault();
							selectItem(item);
						}}
						onclick={() => selectItem(item)}
						onmouseenter={() => (activeIndex = i)}
					>
						{#if itemComponent}
							{@render itemComponent(item)}
						{:else}
							{item.label}
						{/if}
					</li>
				{:else}
					<li class="no-results" role="presentation">{i18n.t('common.noItemsFound')}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.combobox-wrapper {
		display: flex;
	}

	.trigger {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0.4375rem 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		text-align: left;
	}

	.trigger.active:not(:focus-visible) {
		border-color: var(--color-primary);
	}

	.trigger-content {
		flex: 1;
		overflow: hidden;
	}

	.placeholder {
		color: var(--color-text-muted);
		opacity: 1;
	}

	.dropdown-overlay {
		position: fixed;
		z-index: 1000;
		background: var(--color-bg-surface);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-primary);
		border-radius: 0.5rem;
		box-shadow: var(--shadow-sm);
		min-width: 240px;
		display: flex;
		flex-direction: column;
	}

	.search-container {
		padding: 8px;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.search-container input {
		width: 100%;
		padding: 0.25rem 0.5rem;
		color: var(--color-text-primary);
		background-color: var(--color-bg-primary);
		border: 1px solid var(--color-border-tertiary);
		border-radius: 0.5rem;
	}

	.search-container input::placeholder {
		color: var(--color-text-muted);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 4px;
		max-height: min(400px, 50vh);
		overflow-y: auto;
	}

	li {
		padding: 8px 12px;
		cursor: pointer;
		border-radius: 4px;
		color: var(--color-text-primary);
	}

	li.highlighted {
		background-color: var(--color-bg-subtle);
	}

	li.selected {
		background-color: var(--color-interactive-active-bg);
		color: var(--color-interactive-active-fg);
		font-weight: 500;
	}

	.no-results {
		padding: 12px;
		color: var(--color-text-disabled);
		font-style: italic;
	}

	.chevron {
		display: flex;
		align-items: center;
		opacity: 0.7;
		flex-shrink: 0;
		color: var(--color-icon-primary);
		pointer-events: none;
	}

	.chevron :global(svg) {
		pointer-events: none;
	}

	.clear-btn {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		color: var(--color-icon-primary);
		opacity: 0.5;
		cursor: pointer;
		border-radius: 50%;
	}

	.clear-btn:hover {
		opacity: 1;
	}
</style>
