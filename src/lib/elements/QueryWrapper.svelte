<script module lang="ts">
	/**
	 * Sentinel error value a query can report (e.g. for 403 responses) so the
	 * wrapper renders an access-denied state instead of a retryable error.
	 */
	export const ACCESS_DENIED_ERROR = 'access-denied';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	import i18n from '$lib/i18n/index.svelte';

	import Button from './Button.svelte';
	import Spinner from './Spinner.svelte';

	type QueryProps = {
		loading: boolean;
		error?: unknown;
		data?: unknown;
		reload: () => void;
	};

	type Props = {
		queries: QueryProps[];
		children?: Snippet;
	};

	const { queries, children }: Props = $props();

	const failedQueries = $derived(queries.filter((query) => query.error));
	const hasError = $derived(failedQueries.length > 0);
	const accessDenied = $derived(
		hasError && failedQueries.every((query) => query.error === ACCESS_DENIED_ERROR)
	);

	// A query that is loading without any data yet means the content below would
	// render a false empty state — show a spinner instead. Background reloads
	// (loading with data present) keep the content visible.
	const initialLoading = $derived(
		queries.some((query) => query.loading && query.data === undefined)
	);

	function retryFailedQueries() {
		queries.forEach((query) => {
			if (query.error) {
				query.reload();
			}
		});
	}
</script>

{#if accessDenied}
	<div class="error">
		<div>{i18n.t('errors.noAccess')}</div>
	</div>
{:else if hasError}
	<div class="error">
		<div>{i18n.t('common.genericError')}</div>
		<div>
			<Button icon="retry" label={i18n.t('common.retry')} onClick={retryFailedQueries} />
		</div>
	</div>
{:else if initialLoading}
	<div class="loading">
		<Spinner />
	</div>
{:else if children}
	{@render children()}
{/if}

<style>
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1.5rem;
	}

	.loading {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 6rem;
		padding: 2rem;
	}
</style>
