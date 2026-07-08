/**
 * Result contract for async actions passed into components: either a success
 * carrying data or a failure carrying an error. Structurally compatible with
 * svelte-tiny-query's LoadResult, so query mutations can be passed directly.
 */
export type LoadResult<TData, TError> =
	| { success: true; data: TData }
	| { success: false; error: TError };
