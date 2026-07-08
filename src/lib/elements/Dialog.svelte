<script lang="ts">
	import { onMount, setContext, type Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import Close from '~icons/material-symbols/close-rounded';

	import i18n from '$lib/i18n/index.svelte';
	import type { LoadResult } from '$lib/utils/load-result';

	import Button from './Button.svelte';
	import ConfirmDialog from './ConfirmDialog.svelte';
	import Message from './Message.svelte';
	import Spinner from './Spinner.svelte';

	type Action = () => Promise<LoadResult<unknown, string>> | void;

	type Props = {
		title: string;
		role?: 'dialog' | 'alertdialog';
		width?: 'small' | 'medium' | 'large' | 'x-large';
		cancelLabel?: string;
		submitLabel?: string;
		confirmCloseWhen?: boolean;
		confirmCloseMessage?: string;
		deleteOptions?: {
			onDelete: Action;
			label?: string;
			confirmMessage?: string;
			skipConfirm?: boolean;
		};
		children: Snippet;
		onSubmit?: Action;
		onSuccess?: () => void;
		onClose: () => void;
	};

	let {
		title,
		role = 'dialog',
		width = 'medium',
		submitLabel = i18n.t('dialog.submit'),
		cancelLabel = i18n.t('dialog.cancel'),
		confirmCloseWhen = false,
		confirmCloseMessage = i18n.t('dialog.confirmDiscardChanges'),
		deleteOptions,
		children,
		onSubmit,
		onSuccess,
		onClose
	}: Props = $props();

	let dialogRef: HTMLDialogElement | undefined = $state(undefined);

	setContext('portal-target', () => dialogRef);
	let isLoading = $state(false);
	let error: string | null = $state(null);
	let mouseClickStartedOnBackdrop = $state(false);
	let showConfirmCloseDialog = $state(false);

	onMount(() => {
		if (dialogRef && !dialogRef.open) dialogRef.showModal();
	});

	// Native <dialog> does not have a built-in "click outside to close".
	// This is the standard hack: The dialog element stretches to fill the screen
	// but the content box is smaller.
	// We close the dialog if the mouse was pressed down on the backdrop and released there too.
	function handleContainerMousedown(e: MouseEvent) {
		if (dialogRef && e.target === dialogRef) {
			mouseClickStartedOnBackdrop = true;
		}
	}

	function handleContainerClick(e: MouseEvent) {
		if (dialogRef && e.target === dialogRef && mouseClickStartedOnBackdrop) {
			void requestClose();
		}
		mouseClickStartedOnBackdrop = false;
	}

	function handleClose() {
		if (dialogRef?.open) {
			dialogRef.close();
		}
	}

	async function requestClose() {
		if (isLoading) return;

		if (confirmCloseWhen) {
			showConfirmCloseDialog = true;
			return;
		}

		handleClose();
	}

	function confirmClose() {
		showConfirmCloseDialog = false;
		handleClose();
	}

	async function handleAction(fn: Action) {
		if (isLoading) return;

		isLoading = true;
		error = null;

		try {
			const res = await fn();

			if (res && res.success === false) {
				error = res.error;
				isLoading = false;
			} else {
				handleClose();
				onSuccess?.();
			}
		} catch (e) {
			console.error('Dialog action error:', e);
			error = i18n.t('errors.unexpectedError');
			isLoading = false;
		}
	}
</script>

{#if showConfirmCloseDialog}
	<ConfirmDialog
		title={i18n.t('common.confirm')}
		message={confirmCloseMessage}
		confirmLabel={i18n.t('common.discard')}
		onConfirm={confirmClose}
		onClose={() => {
			showConfirmCloseDialog = false;
		}}
	/>
{/if}

<dialog
	bind:this={dialogRef}
	{role}
	aria-label={title}
	onclose={onClose}
	onclick={handleContainerClick}
	oncancel={(e) => {
		e.preventDefault();
		void requestClose();
	}}
	onmousedown={handleContainerMousedown}
>
	<form class="dialog-box dialog-box-width-{width}">
		{#if isLoading}
			<Spinner floating />
		{/if}

		<header>
			<span>{title}</span>
			<button
				type="button"
				class="icon"
				onclick={() => {
					void requestClose();
				}}><Close /></button
			>
		</header>

		<div class="content">
			{#if error}
				<div transition:slide>
					<Message text={error} type="error" />
				</div>
			{/if}

			{@render children()}
		</div>

		<footer>
			<div class="left">
				{#if deleteOptions}
					<Button
						variant="tertiary"
						label={deleteOptions.label ?? i18n.t('common.delete')}
						confirmOptions={deleteOptions.skipConfirm
							? undefined
							: {
									message: deleteOptions.confirmMessage ?? i18n.t('common.confirmDelete')
								}}
						disabled={isLoading}
						onClick={() => {
							handleAction(deleteOptions.onDelete);
						}}
					/>
				{/if}
			</div>

			<div class="right">
				<Button
					label={cancelLabel}
					variant="tertiary"
					disabled={isLoading}
					onClick={() => {
						void requestClose();
					}}
				/>
				{#if onSubmit}
					<Button
						label={submitLabel}
						variant="primary"
						type="submit"
						disabled={isLoading}
						onClick={() => {
							handleAction(onSubmit);
						}}
					/>
				{/if}
			</div>
		</footer>
	</form>
</dialog>

<style>
	dialog {
		border: none;
		padding: 0;
		border-radius: 0.5rem;
		margin: auto;

		&::backdrop {
			background: var(--color-overlay);
		}

		&:focus-visible {
			outline: none;
		}
	}

	.dialog-box {
		position: relative;
		background-color: var(--color-bg-surface);
		color: var(--color-text-primary);
		display: flex;
		flex-direction: column;
		overflow: clip;
		width: 90vw;
		max-height: 80vh;

		&.dialog-box-width-small {
			max-width: 400px;
		}

		&.dialog-box-width-medium {
			max-width: 640px;
		}

		&.dialog-box-width-large {
			max-width: 1000px;
		}

		&.dialog-box-width-x-large {
			max-width: 1400px;
		}

		header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
			padding: 1rem 1.5rem;
			border-bottom: var(--color-divider) 1px solid;
			color: var(--color-text-primary);

			.icon {
				cursor: pointer;
				color: var(--color-icon-primary);
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 1rem 1.5rem;
			flex: 1 1 auto;
			min-height: 0;
			overflow-y: auto;
			background: var(--color-bg-primary);
		}

		footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			gap: 1rem;
			padding: 1rem 1.5rem;

			background-color: var(--color-bg-primary);
			border-top: var(--color-border-primary) 1px solid;

			.left,
			.right {
				display: flex;
				gap: 0.5rem;
			}

			.right {
				flex-grow: 1;
				justify-content: flex-end;
			}
		}
	}

	/* Lock body scroll while component is present */
	:global(body:has(dialog[open])) {
		overflow: hidden;
	}
</style>
