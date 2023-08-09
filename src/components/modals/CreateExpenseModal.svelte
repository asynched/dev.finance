<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade, fly, scale } from 'svelte/transition'
	import Input from '@/components/common/Input.svelte'

	const dispatch = createEventDispatcher<{ close: void }>()
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
		class="bg-gray-100 p-8 rounded w-[90%] max-w-[32rem]"
	>
		<h1 class="mb-2 text-2xl">Criar nova transação</h1>
		<form action="?/create" method="POST" class="grid gap-4">
			<Input
				label="Descrição"
				type="text"
				name="name"
				placeholder="Descrição"
			/>
			<Input
				label="Valor"
				type="number"
				name="amount"
				placeholder="0,00"
				description="Use o sinal - (negativo) para registrar gastos"
			/>
			<Input label="Data da transação" type="date" name="date" />
			<div class="grid grid-cols-2 gap-4">
				<button
					class="py-2 px-4 border-2 border-red-600 text-red-600 rounded transition-base hover:bg-red-600 hover:text-white"
					type="button"
					on:click={() => dispatch('close')}
				>
					Cancelar
				</button>
				<button
					class="py-2 px-4 bg-green-600 text-white rounded transition-base hover:bg-green-500"
					type="submit"
				>
					Salvar
				</button>
			</div>
		</form>
	</div>
</div>
