<script>
	import HowItWorks from './HowItWorks.svelte';

	import PromptForm from './PromptForm.svelte';

	let userPrompt = $state('');
</script>

<header>
	<div class="cloud-logo"></div>
	<div>
		<HowItWorks></HowItWorks>
	</div>
</header>
<main>
	<h1 class="text-3d">Submit a prompt to test Model Armor</h1>
	<PromptForm bind:userPrompt></PromptForm>
</main>

<svelte:head>
	<style>
		body {
			background-image: url('/img/bg-color.svg');
		}
	</style>
</svelte:head>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		margin: 0 20px;
	}

	main {
		width: 70%;
		margin: 0 auto;
	}

	.cloud-logo {
		width: 50px;
		height: 40px;
		background-image: url('/img/cloud-logo.svg');
		background-size: contain;
		background-position: center center;
		background-repeat: no-repeat;
	}
</style>
