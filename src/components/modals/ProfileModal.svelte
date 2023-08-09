<script lang="ts">
	import type { Session } from '@prisma/client'
	import { createEventDispatcher } from 'svelte'
	import { fade, fly, scale } from 'svelte/transition'

	export let user: AuthUser
	export let sessions: Session[]

	const dispatch = createEventDispatcher<{ close: void }>()

	function parseUserAgent(ua: string) {
		const os = ua.match(
			/(Windows|Macintosh|Linux|Android|iOS|iPadOS|CrOS|PlayStation|Nintendo|Xbox)/,
		)?.[0]
		const browser = ua.match(
			/(Firefox|Chrome|Safari|Opera|Edge|Trident)\/(\d+)/,
		)?.[0]

		return {
			os,
			browser,
		}
	}
</script>

<div
	class="w-full h-screen bg-black bg-opacity-50 grid place-items-center fixed top-0 bottom-0 z-10 text-sm backdrop-blur-sm"
	role="dialog"
	in:fade
	out:fade={{ delay: 200 }}
>
	<div
		in:fly={{ y: -250, delay: 200 }}
		out:scale
		class="bg-gray-100 p-8 rounded w-[90%] max-w-[32rem] flex flex-col relative"
	>
		<button
			aria-label="Fechar modal"
			class="absolute top-8 right-8"
			on:click={() => dispatch('close')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6 text-gray-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
		<h1 class="mb-2 text-2xl">Perfil</h1>
		<p>Nome: {user.name}</p>
		<p>E-mail: {user.email}</p>
		<p class="mb-4">Entrou em: {user.createdAt.toLocaleDateString()}</p>
		<h2 class="mb-2 text-2xl">Sessões</h2>
		<ul class="grid gap-2 mb-4">
			{#each sessions as session}
				{@const agent = parseUserAgent(session.userAgent)}
				<li class="flex items-center gap-4">
					<div class="w-10 h-10 bg-gray-200 grid place-items-center rounded">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 text-gray-600"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
							/>
						</svg>
					</div>
					<div>
						<p>{agent.browser} - {agent.os}</p>
						<p>{session.ip === '::1' ? '127.0.0.1' : session.ip}</p>
					</div>
				</li>
			{/each}
		</ul>
		<form class="self-end" action="?/logoff" method="POST">
			<button
				class="py-2 px-4 border-2 border-red-600 text-red-600 rounded transition-base hover:bg-red-600 hover:text-white"
			>
				Sair
			</button>
		</form>
	</div>
</div>
