<script lang="ts">
	import type { LoadResult } from '$lib/utils/load-result';

	import Dialog from './Dialog.svelte';

	type Props = {
		title: string;
		message: string;
		confirmLabel?: string;
		onConfirm?: () => Promise<LoadResult<unknown, string>> | void;
		onClose: () => void;
	};

	let { title, message, confirmLabel, onConfirm, onClose }: Props = $props();
</script>

<Dialog
	width="small"
	role="alertdialog"
	{title}
	submitLabel={confirmLabel}
	onSubmit={onConfirm}
	{onClose}
>
	<p>{message}</p>
</Dialog>
