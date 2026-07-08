<script lang="ts" generics="T extends { id: number }">
	import type { Snippet } from 'svelte';

	import i18n from '$lib/i18n/index.svelte';

	import ListItem from './ListItem.svelte';

	type Props = {
		items: T[];
		itemComponent: Snippet<[T]>;
		nestedItemComponent?: Snippet<[T]>;
		onMove: (dragItem: T, dropItem: T, edge: 'top' | 'bottom') => void;
	};

	const { items, itemComponent, nestedItemComponent, onMove }: Props = $props();

	const listId = Math.random().toString(36).substring(7);

	function moveItem(dragItemId: number, dropItemId: number, edge: 'top' | 'bottom') {
		const dragItem = items.find((item) => item.id === dragItemId);
		const dropItem = items.find((item) => item.id === dropItemId);
		if (!dragItem || !dropItem) return;

		onMove(dragItem, dropItem, edge);
	}
</script>

<div class="orderable-list">
	{#each items as item (item.id)}
		<ListItem {listId} {item} {itemComponent} {nestedItemComponent} onMove={moveItem} />
	{:else}
		<p class="no-entries">{i18n.t('common.noEntries')}</p>
	{/each}
</div>

<style>
	.orderable-list {
		display: flex;
		flex-direction: column;
	}

	.no-entries {
		padding: 1rem;
		text-align: center;
	}
</style>
