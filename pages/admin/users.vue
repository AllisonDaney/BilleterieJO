<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { SelectSafeUser } from '~/server/database/schema/users'
import { useInfiniteScroll } from '@vueuse/core'

const UAvatar = resolveComponent('UAvatar')

interface UserResponse {
  users: SelectSafeUser[]
  total: number
  skip: number
  limit: number
}

const columns: TableColumn<SelectSafeUser>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstname',
    header: 'First name',
  },
  {
    accessorKey: 'lastname',
    header: 'Last name',
  },
]
const limit = 20

const table = useTemplateRef<ComponentPublicInstance>('table')
const tableContainer = useTemplateRef<HTMLDivElement>('tableContainer')
const tableHeight = ref(100)
const usersLength = ref(0)
const skip = ref(0)
const users = ref<SelectSafeUser[]>([])
const userRowHeight = ref(52)
const initialTableHeightCalculation = ref(false)

const { data, status, execute } = await useFetch(
  '/api/users',
  {
    key: 'table-users-infinite-scroll',
    params: { skip, limit, roleSlug: 'user' },
    transform: (data?: UserResponse) => {
      if (!initialTableHeightCalculation.value) {
        tableHeight.value = (tableContainer.value?.clientHeight || 100) - 40

        if ((data?.users?.length || 0) * userRowHeight.value < tableHeight.value) {
          tableHeight.value = (data?.users?.length || 0) * userRowHeight.value + 48
        }
      }

      initialTableHeightCalculation.value = true
      usersLength.value = data?.total || 0
      return data?.users
    },
    lazy: true,
    immediate: false,
  },
)

execute()

onMounted(() => {
  useInfiniteScroll(
    table.value?.$el,
    () => {
      if (skip.value >= usersLength.value) {
        return
      }

      skip.value += limit
    },
    {
      distance: 200,
      canLoadMore: () => {
        return status.value !== 'pending'
      },
    },
  )
})

watch(data, () => {
  users.value = [...users.value, ...(data.value || [])]
})
</script>

<template>
  <div class="flex-1 flex flex-col mx-4">
    <h1 class="text-2xl font-bold mt-4">
      Administration utilisateurs
    </h1>
    <div ref="tableContainer" class="mt-4 h-full">
      <UTable
        ref="table"
        :data="users"
        :columns="columns"
        :loading="status === 'pending'"
        sticky
        class="flex-1 bg-white"
        :style="{ height: `${tableHeight}px` }"
      />
      <p class="mt-4 text-right">
        Affichage de {{ users.length }} utilisateurs sur {{ usersLength }}
      </p>
    </div>
  </div>
</template>
