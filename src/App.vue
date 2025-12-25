<template>
  <div id="app">
    <main>
      <h1>Merry Christmas!</h1>
      <AguinaldoPrompt v-if="!submitted" @form-submitted="onFormSubmitted" />

      <RewardGrid
        v-if="submitted"
        :isGodchild="submitted.isGodchild"
        :name="submitted.name"
        :gcash="submitted.gcash"
        :previousClaim="existingClaim"
        @send-to-tito="onSendToTito"
      />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AguinaldoPrompt from "./components/AguinaldoPrompt.vue";
import RewardGrid from "./components/RewardGrid.vue";
import Footer from "./components/Footer.vue";
import { getClaim, saveSession, getSession, markNotificationSent } from "./utils/storage.js";
import { initEmailJS, sendClaimNotification } from "./utils/emailService.js";
import Swal from "sweetalert2";

const submitted = ref(null);
const existingClaim = ref(null);

// Initialize SweetAlert2 Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'mobile-toast'
  }
});

// Restore session on page load/refresh
onMounted(() => {
  // Initialize EmailJS
  initEmailJS();

  const session = getSession();

  if (session) {
    // Session exists, restore form submission state
    console.log('Restoring session from localStorage');

    // Check if user also has a claim
    const claim = getClaim(session.gcash);

    if (claim) {
      existingClaim.value = claim;
      console.log('Also restoring previous claim');
    } else {
      existingClaim.value = null;
    }

    // Set submitted to restore the form data
    submitted.value = {
      name: session.name,
      gcash: session.gcash,
      isGodchild: session.isGodchild
    };
  }
});

function onFormSubmitted(payload) {
  // Save session to localStorage FIRST
  saveSession({
    name: payload.name,
    gcash: payload.gcash,
    isGodchild: payload.isGodchild
  });

  // Check if user has already claimed
  const claim = getClaim(payload.gcash);

  if (claim) {
    // User has already claimed - show their previous selection
    existingClaim.value = claim;
    submitted.value = payload;
    console.log("Returning user - previous claim found:", claim);
  } else {
    // New user - normal flow
    existingClaim.value = null;
    submitted.value = payload;
    console.log("New user - no previous claim");
  }
}

async function onSendToTito(payload) {
  console.log("Send to Tito payload:", payload);

  // Prepare claim data for email
  const claimData = {
    name: payload.name,
    gcash: payload.gcash,
    reward: payload.selectedRewards[0], // First (and only) reward
    isGodchild: payload.isGodchild,
    cardIndex: payload.cardIndex,
    timestamp: Date.now()
  };

  try {
    // Show loading state (non-blocking)
    Toast.fire({
      icon: 'info',
      title: 'Sending notification...',
      timer: 2000,
      showConfirmButton: false
    });

    // Send email notification to admin (you)
    await sendClaimNotification(claimData);

    // Mark notification as sent in localStorage
    markNotificationSent(payload.gcash);

    // Show success message to user
    Toast.fire({
      icon: 'success',
      title: 'Claim submitted successfully!',
      text: 'Ninong will send your GCash reward soon.',
      timer: 4000
    });

  } catch (error) {
    console.error('Failed to send notification:', error);

    // IMPORTANT: Keep claim saved even if email fails
    // Show error but claim persists in localStorage
    Toast.fire({
      icon: 'error',
      title: 'Notification failed',
      text: 'Your claim was saved, but notification failed. Please contact ninong.',
      timer: 5000
    });

    // You can manually check console logs or localStorage to find missed claims
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
  padding: 2rem;
}
main h1 {
  text-align: center;
}
body {
  font-family: system-ui, sans-serif;
  margin: 0;
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
