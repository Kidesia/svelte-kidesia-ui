<script lang="ts" generics="T extends { id: number }">
	import {
		draggable,
		dropTargetForElements
	} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import {
		attachClosestEdge,
		extractClosestEdge
	} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	// import DragHandle from '../../icons/DragHandle.svelte';

	type Props = {
		item: T;
		listId: string;
		itemComponent: Snippet<[T]>;
		nestedItemComponent?: Snippet<[T]>;
		onMove: (dragItemId: number, dropItemId: number, edge: 'top' | 'bottom') => void;
	};

	const { item, listId, itemComponent, nestedItemComponent, onMove }: Props = $props();

	let el = $state<HTMLElement | null>(null);
	let isDragging = $state(false);
	let isDraggedOver = $state(false);
	let edge = $state<string | null>(null);

	$effect(() => {
		if (el) {
			draggable({
				element: el,
				getInitialData: () => ({ listId: listId, itemId: item.id }),
				onDragStart: () => (isDragging = true),
				onDrop: () => (isDragging = false)
			});

			dropTargetForElements({
				element: el,
				getData: ({ input, element }) => {
					const data = { itemId: item.id };
					return attachClosestEdge(data, {
						input: input,
						element: element,
						allowedEdges: ['top', 'bottom']
					});
				},
				onDragEnter: () => {
					isDraggedOver = true;
				},
				onDragLeave: () => {
					isDraggedOver = false;
				},
				onDrag: ({ self }) => {
					edge = extractClosestEdge(self.data);
				},
				canDrop: ({ source }) => {
					return listId === source.data.listId && source.data.itemId !== item.id;
				},
				onDrop: (args) => {
					const edge = extractClosestEdge(args.self.data);
					if (!edge) return;
					onMove(args.source.data.itemId as number, item.id, edge as 'top' | 'bottom');
					isDraggedOver = false;
				}
			});
		}
	});
</script>

<div class="list-item-container" class:is-dragging={isDragging} bind:this={el} transition:slide>
	{#if isDraggedOver}
		<div class="drop-preview {edge}"></div>
	{/if}

	<div class="list-item">
		<div class="icon drag-handle">::</div>
		<div class="list-item-content">
			{@render itemComponent(item)}
		</div>
	</div>

	{#if nestedItemComponent}
		<div class="nested-item">
			{@render nestedItemComponent(item)}
		</div>
	{/if}
</div>

<style>
	.list-item-container {
		position: relative;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.list-item {
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem;
		padding-left: 0.75rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border-primary);
		background-color: var(--color-bg-surface);
		user-select: none;

		&:hover {
			background-color: var(--color-highlight-bg);
			border: 1px solid var(--color-highlight-border);
		}

		> div {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 0.5rem;
		}

		> .list-item-content {
			flex: 1;
		}
	}

	.drag-handle {
		cursor: grab;
		color: var(--color-text-muted);
	}

	:global(.icon > svg) {
		width: 1.2rem;
		height: 1.2rem;
	}

	.is-dragging {
		opacity: 0.3;
	}

	.nested-item {
		padding-left: 1rem;
		padding-top: 3px;
	}

	:global(.nested-item > .orderable-list) {
		padding: 0;
	}

	.drop-preview {
		position: absolute;
		left: -6px;
		right: 0;
		width: 100%;
		height: 2px;
		background-color: var(--color-link);
		z-index: 10;

		&.top {
			top: -1px;
		}

		&.bottom {
			bottom: -1px;
		}

		&::after {
			content: '';
			position: absolute;
			top: -6px;
			z-index: 10;
			display: block;
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background-color: var(--color-bg-surface);
			border: 2px solid var(--color-link);
		}
	}
</style>
