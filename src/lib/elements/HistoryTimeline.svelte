<script lang="ts" module>
	export type TimelineFieldChange = {
		field: string;
		label: string;
		oldDisplay: string | null;
		newDisplay: string;
	};

	export type TimelineEntry = {
		id: number;
		performer: string;
		createdAt: Date;
		actionTitle?: string;
		actionVariant?: 'neutral' | 'approved' | 'rejected';
		note?: string;
		fieldChanges?: TimelineFieldChange[];
	};
</script>

<script lang="ts">
	import { formatDateTime } from '$lib/utils/format';

	import Spinner from './Spinner.svelte';

	type Props = {
		entries: TimelineEntry[];
		loading?: boolean;
	};

	const { entries, loading = false }: Props = $props();
</script>

<div class="history-container">
	{#if loading}
		<div class="loading"><Spinner /></div>
	{:else}
		<ul class="timeline">
			{#each entries as entry (entry.id)}
				<li class="timeline-item">
					<div class="timeline-marker"></div>
					<div class="timeline-content">
						<div class="header">
							<span class="performer">{entry.performer}</span>
							<span class="time">{formatDateTime(entry.createdAt)}</span>
						</div>

						{#if entry.actionTitle}
							<div
								class="action-title"
								class:approved={entry.actionVariant === 'approved'}
								class:rejected={entry.actionVariant === 'rejected'}
							>
								{entry.actionTitle}
							</div>
						{/if}

						{#if entry.note}
							<p class="note">{entry.note}</p>
						{/if}

						{#if entry.fieldChanges && entry.fieldChanges.length > 0}
							<div class="changes">
								{#each entry.fieldChanges as change (change.field)}
									<div class="change-row">
										<span class="field-name">{change.label}</span>
										<div class="field-diff">
											{#if change.oldDisplay !== null}
												<span class="val old">{change.oldDisplay}</span>
												<span class="arrow">→</span>
											{/if}
											<span class="val new">{change.newDisplay}</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.history-container {
		padding: 1rem 0;
		font-size: 0.9rem;
		text-align: left;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 2rem;
		color: var(--color-text-tertiary);
	}

	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		border-left: 2px solid var(--color-border-primary);
		margin-left: 0.75rem;
	}

	.timeline-item {
		position: relative;
		padding-left: 1.5rem;
		padding-bottom: 1.5rem;
	}

	.timeline-item:last-child {
		padding-bottom: 0;
	}

	.timeline-marker {
		position: absolute;
		left: -0.38rem;
		top: 0.2rem;
		width: 0.8rem;
		height: 0.8rem;
		background-color: var(--color-bg-surface);
		border: 2px solid var(--color-primary);
		border-radius: 50%;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
		margin-bottom: 0.25rem;
		color: var(--color-text-secondary);
		font-size: 0.85rem;
	}

	.performer {
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.time {
		color: var(--color-text-tertiary);
		font-size: 0.8rem;
	}

	.action-title {
		font-weight: 500;
		color: var(--color-text-secondary);
		margin-bottom: 0.25rem;
	}

	.action-title.approved {
		color: var(--color-success);
	}

	.action-title.rejected {
		color: var(--color-error-emphasis);
	}

	.note {
		margin: 0 0 0.25rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-primary);
		border-radius: 6px;
		background: var(--color-bg-surface-hover);
		color: var(--color-text-primary);
		font-size: 0.85rem;
		white-space: pre-wrap;
	}

	.changes {
		background: var(--color-bg-surface-hover);
		border: 1px solid var(--color-border-primary);
		border-radius: 6px;
		padding: 0.75rem;
		font-size: 0.85rem;
		text-align: left;
		color: var(--color-text-primary);
	}

	.change-row {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-bottom: 0.5rem;
		line-height: 1.4;
	}

	.change-row:last-child {
		margin-bottom: 0;
	}

	.field-name {
		font-weight: 500;
		color: var(--color-text-secondary);
		font-size: 0.8rem;
		margin-bottom: 0.1rem;
	}

	.field-diff {
		font-family: var(--font-mono);
		word-break: break-all;
		padding-left: 0.5rem;
		width: 100%;
		text-align: left;
		color: var(--color-text-primary);
	}

	.val.old {
		text-decoration: line-through;
		color: var(--color-error-emphasis);
		opacity: 0.7;
	}

	.arrow {
		color: var(--color-text-disabled);
		margin: 0 0.3rem;
	}

	.val.new {
		color: var(--color-success);
		font-weight: 600;
	}
</style>
