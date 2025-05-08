<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <main class="flex-1 container mt-4 mx-auto flex">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
