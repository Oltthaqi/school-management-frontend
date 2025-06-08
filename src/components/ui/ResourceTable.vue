<script setup lang="ts">
import { PropType } from "vue";
import Card from "./Card.vue";
import Table from "./Table.vue";
import Button from "./Button.vue";

// Define column structure
type Column<T> = {
  label: string;
  field: keyof T;
  format?: (value: any, row: T) => string;
};

type Action<T> = {
  label: string;
  onClick: (item: T) => void;
  show?: (item: T) => boolean;
  variant?: "primary" | "secondary" | "danger";
};

const props = defineProps<{
  title: string;
  items: any[];
  columns: Column<any>[];
  actions?: Action<any>[];
  onCreate?: () => void;
  canCreate?: boolean;
}>();
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
      <Button v-if="canCreate && onCreate" @click="onCreate">
        Add {{ title.slice(0, -1) }}
      </Button>
    </div>

    <Card>
      <Table>
        <template #header>
          <th
            v-for="col in columns"
            :key="col.label"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </template>

        <tr v-for="item in items" :key="item.id">
          <td
            v-for="col in columns"
            :key="col.field.toString()"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <span
              v-if="col.format"
              v-html="col.format(item[col.field], item)"
            ></span>
            <span v-else>{{ item[col.field] }}</span>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div class="flex space-x-2">
              <template
                v-for="(action, index) in actions || []"
                :key="`${action?.label}-${index}`"
              >
                <Button
                  v-if="action && (!action.show || action.show(item))"
                  :variant="action.variant || 'secondary'"
                  size="sm"
                  @click="() => action.onClick(item)"
                >
                  {{ action.label }}
                </Button>
              </template>
            </div>
          </td>
        </tr>
      </Table>
    </Card>
  </div>
</template>
