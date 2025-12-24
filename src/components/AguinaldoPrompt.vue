<template>
  <div class="aguinaldo-prompt">
    <div v-if="!answered" class="modal">
      <h2>Are you my inaanak?</h2>
      <div class="btn-row">
        <button class="yes" @click="answer(true)">Yes</button>
        <button class="no" @click="answer(false)">No</button>
      </div>
    </div>

    <div v-else class="form">
      <h3>{{ isGodchild ? "Welcome, inaanak!" : "Welcome!" }}</h3>
      <label>
        Name
        <input v-model="name" placeholder="Full name" />
      </label>
      <label>
        GCash number
        <input
          v-model="gcash"
          placeholder="e.g. 09171234567"
          inputmode="numeric"
          pattern="\d{11}"
          maxlength="11"
          @input="onGcashInput"
        />
      </label>
      <div class="actions">
        <button @click="submit" :disabled="!valid">Continue</button>
        <button class="link" @click="reset">Change answer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const answered = ref(false);
const isGodchild = ref(false);
const name = ref("");
const gcash = ref("");
const emit = defineEmits(["form-submitted"]);

function answer(val) {
  isGodchild.value = val;
  answered.value = true;
}

function reset() {
  answered.value = false;
  isGodchild.value = false;
  name.value = "";
  gcash.value = "";
}

function onGcashInput(e) {
  const raw = e.target.value || "";
  const digits = raw.replace(/\D+/g, "");
  // If non-digit characters were present, notify user depending on role
  if (/\D/.test(raw)) {
    const title = "Numbers only";
    const text = isGodchild.value
      ? "Please enter numbers only for my inaanak."
      : "Please enter numbers only.";
    Swal.fire({
      toast: true,
      icon: "warning",
      title,
      text,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
      position: "top",
      customClass: { popup: "mobile-toast" },
    });
  }
  gcash.value = digits.slice(0, 11);
}

const valid = computed(() => {
  const n = name.value.trim();
  const g = gcash.value.replace(/\s+/g, "");
  return n.length > 0 && /^\d{11}$/.test(g);
});

function submit() {
  if (!valid.value) return;
  emit("form-submitted", {
    isGodchild: isGodchild.value,
    name: name.value.trim(),
    gcash: gcash.value.replace(/\s+/g, ""),
  });
}
</script>

<style scoped>
.aguinaldo-prompt {
  max-width: 460px;
  margin: 1rem auto;
}
.modal {
  background: #fff8f0;
  border: 2px solid #f2d0d0;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
}
.btn-row {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.8rem;
}
button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
button.yes {
  background: #d63131;
  color: white;
}
button.no {
  background: #2b8a3e;
  color: white;
}
.form {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #eee;
}
label {
  display: block;
  margin: 0.6rem 0;
  font-size: 0.95rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
.actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-top: 0.7rem;
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
button.link {
  background: transparent;
  color: #666;
  padding: 0.4rem 0.6rem;
}
</style>
