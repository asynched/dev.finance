<script lang="ts">
	import Input from '@/components/common/Input.svelte'
</script>

<svelte:head>
	<title>DevFinance | Cadastre-se</title>
</svelte:head>

<div
	class="w-full h-screen bg-gradient-to-br from-green-600 to-green-700 grid place-items-center"
>
	<div class="p-8 bg-gray-100 rounded shadow-xl w-[90%] max-w-sm">
		<h1
			class="mb-2 text-5xl font-bold tracking-tighter text-green-600 text-center"
		>
			Cadastro
		</h1>
		<p class="mb-4 text-gray-600 text-center">
			Entre no aplicativo para cadastrar <br /> suas finanças
		</p>
		<form method="POST" class="grid gap-4">
			<Input type="text" label="Nome" name="name" placeholder="Seu nome" />
			<Input
				label="E-mail"
				name="email"
				placeholder="Seu e-mail"
				type="email"
			/>
			<Input
				type="password"
				label="Senha"
				name="password"
				placeholder="Sua senha"
			/>
			<button
				type="submit"
				class="py-2 px-4 bg-green-600 text-white rounded transition-base hover:bg-green-500"
			>
				Cadastrar
			</button>
			<p class="text-sm text-gray-600 text-center">
				Já possui uma conta?
				<a class="text-green-600 hover:underline" href="/">Faça login</a>
			</p>
		</form>
	</div>
</div>
