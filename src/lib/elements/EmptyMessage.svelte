<script lang="ts">
	type Props = {
		message: string;
	};

	const { message }: Props = $props();
</script>

<p class="empty-message">{message}</p>

<style>
	.empty-message {
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
