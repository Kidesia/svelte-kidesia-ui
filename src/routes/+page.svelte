<script lang="ts">
	import '$lib/styles/tokens.css';

	import Badge from '$lib/elements/Badge.svelte';
	import Button from '$lib/elements/Button.svelte';
	import Card from '$lib/elements/Card.svelte';
	import Message from '$lib/elements/Message.svelte';
	import Spinner from '$lib/elements/Spinner.svelte';

	let clicks = $state(0);

	function handleClick() {
		clicks += 1;
	}
</script>

<main>
	<h1>kidesia-ui</h1>
	<p>
		Shared component library of the Kidesia / Timesia frontend family. Run
		<code>pnpm storybook</code> for the full catalog; this page is a minimal smoke test.
	</p>

	<Card title="Smoke test">
		<div class="row">
			<Button label="Primary ({clicks})" variant="primary" onClick={handleClick} />
			<Button label="Success" variant="success" onClick={handleClick} />
			<Badge label="Badge" variant="info" />
			<Spinner />
		</div>
		<Message text="Components render without an app around them." />
	</Card>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		color: var(--color-text-primary);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-bottom: 1rem;
	}
</style>
