<template>
  <main>
    <h1>Aguinaldo Generator</h1>
    <AguinaldoPrompt v-if="!submitted" @form-submitted="onFormSubmitted" />

    <RewardGrid
      v-if="submitted"
      :isGodchild="submitted.isGodchild"
      :name="submitted.name"
      :gcash="submitted.gcash"
      @send-to-tito="onSendToTito"
    />
  </main>
</template>

<script>
import AguinaldoPrompt from "./components/AguinaldoPrompt.vue";
import RewardGrid from "./components/RewardGrid.vue";

export default {
  name: "App",
  components: { AguinaldoPrompt, RewardGrid },
  data() {
    return { submitted: null };
  },
  methods: {
    onFormSubmitted(payload) {
      this.submitted = payload;
      console.log("Form submitted:", payload);
    },
    onSendToTito(payload) {
      console.log("Send to Tito payload:", payload);
      // TODO: call backend endpoint to email Tito (step 7)
      // For now, just show console log — later we'll POST to a serverless function.
      alert("Payload prepared. Check console for details.");
    },
  },
};
</script>

<style>
body {
  font-family: system-ui, sans-serif;
  margin: 2rem;
}
.summary {
  margin-top: 1rem;
  background: #fbfbfb;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #eee;
}

/* Mobile-friendly SweetAlert2 toast styles */
.mobile-toast.swal2-popup {
  width: calc(100% - 32px) !important;
  max-width: none !important;
  left: 16px !important;
  right: 16px !important;
  border-radius: 12px !important;
  padding: 0.65rem 0.9rem !important;
  box-sizing: border-box;
  font-size: 0.95rem;
}

@media (min-width: 520px) {
  .mobile-toast.swal2-popup {
    width: auto !important;
    max-width: 440px !important;
    left: auto !important;
    right: auto !important;
  }
}
</style>
