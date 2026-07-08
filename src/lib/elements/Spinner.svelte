<script lang="ts">
	type Props = {
		text?: string;
		size?: 'small' | 'medium' | 'large';
		floating?: boolean;
	};

	const { text, size, floating }: Props = $props();
</script>

{#snippet spinner()}
	<div class="spinner">
		<div class={size}></div>
		{#if text}
			<p>{text}</p>
		{/if}
	</div>
{/snippet}

{#if floating}
	<div class="spinner-container">
		{@render spinner()}
	</div>
{:else}
	{@render spinner()}
{/if}

<style>
	.spinner-container {
		position: absolute;
		inset: 0;
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-overlay-light);
	}

	.spinner {
		--_g: no-repeat radial-gradient(circle closest-side, var(--color-primary) 90%, #00000000);

		& > div {
			width: 64px;
			aspect-ratio: 2;
			background:
				var(--_g) 0% 50%,
				var(--_g) 50% 50%,
				var(--_g) 100% 50%;
			background-size: calc(100% / 3) 50%;
			animation: dot-float 1.5s infinite linear;

			&.small {
				width: 32px;
			}

			&.medium {
				width: 64px;
			}

			&.large {
				width: 100px;
			}
		}

		p {
			display: flex;
			justify-content: center;
			margin: auto;
			margin-top: 1rem;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--color-primary);
		}
	}

	@keyframes dot-float {
		20% {
			background-position:
				0% 0%,
				50% 50%,
				100% 50%;
		}
		40% {
			background-position:
				0% 100%,
				50% 0%,
				100% 50%;
		}
		60% {
			background-position:
				0% 50%,
				50% 100%,
				100% 0%;
		}
		80% {
			background-position:
				0% 50%,
				50% 50%,
				100% 100%;
		}
	}
</style>
