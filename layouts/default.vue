<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <AppHeader />

    <main class="flex-1 flex items-center justify-center">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
