<script lang="ts">
	import i18n from '$lib/i18n/index.svelte';
</script>

<p class="coming-soon">{i18n.t('common.comingSoon')}</p>

<style>
	.coming-soon {
		color: var(--color-text-muted);
		margin: 0;
	}
</style>
