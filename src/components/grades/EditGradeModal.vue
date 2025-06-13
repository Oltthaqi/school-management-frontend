<script setup lang="ts">
import { gradeService } from "../../services/gradeService";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import { toast } from "vue3-toastify";
import type { Grade } from "../../types";

const props = defineProps<{
  grade: Grade;
  letterGrades: string[];
  form: {
    gradeValue: number;
    letterGrade: string;
    comments: string;
  };
}>();

const emit = defineEmits(["close", "refresh"]);

const saveGrade = async () => {
  try {
    await gradeService.update(props.grade.id, props.form);
    emit("refresh");
    emit("close");
    toast.success("Grade updated successfully.");
  } catch (error) {
    console.error("Failed to update grade:", error);
    toast.error("Failed to update grade.");
  }
};
</script>

<template>
  <Modal @close="() => emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Grade</h3>
      <form @submit.prevent="saveGrade" class="space-y-4">
        <div>
          <label class="form-label">Grade Value</label>
          <input
            v-model.number="props.form.gradeValue"
            type="number"
            min="0"
            max="100"
            class="form-input"
            required
          />
        </div>
        <div>
          <label class="form-label">Letter Grade</label>
          <select v-model="props.form.letterGrade" class="form-input" required>
            <option value="">Select</option>
            <option v-for="g in props.letterGrades" :key="g" :value="g">
              {{ g }}
            </option>
          </select>
        </div>
        <div>
          <label class="form-label">Comments</label>
          <textarea
            v-model="props.form.comments"
            class="form-input"
            rows="3"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" @click.prevent="() => emit('close')">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  </Modal>
</template>
