<script lang="ts">
	import DOMPurify from 'dompurify';

	type Props = {
		html: string;
	};

	const { html }: Props = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html DOMPurify.sanitize(html)}
