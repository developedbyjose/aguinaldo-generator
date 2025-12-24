<template>
  <div class="reward-area">
    <header class="reward-header">
      <h2>Pick a gift, {{ name.split(" ")[0] || "friend" }}!</h2>
      <p class="role">
        {{ isGodchild ? "Inaanak — special picks!" : "Guest — good luck!" }}
      </p>
    </header>

    <div class="grid">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        class="card"
        :class="{ revealed: card.revealed, disabled: card.disabled }"
        @click="reveal(idx)"
        :aria-disabled="card.disabled"
      >
        <div class="face front" aria-hidden="true">
          <div class="gift">
            <img :src="props.cardImage" alt="card image" class="gift-img" />
          </div>
        </div>
        <div class="face back" aria-hidden="true">
          <div class="reward-value">₱ {{ card.reward }}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="picked">Picked: {{ pickedCount }}</div>
      <button class="send" :disabled="pickedCount === 0" @click="sendToTito">
        {{ isGodchild ? "Claim from ninong" : "Claim" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
const props = defineProps({
  isGodchild: Boolean,
  name: { type: String, default: "" },
  gcash: { type: String, default: "" },
  cardImage: { type: String, default: "/reindeer.png" },
});
const emit = defineEmits(["send-to-tito"]);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const cards = reactive(
  Array.from({ length: 6 }, () => ({
    revealed: false,
    reward: 0,
    disabled: false,
  }))
);

function generateReward() {
  if (props.isGodchild) return randInt(500, 1000);
  return randInt(50, 200);
}

function reveal(i) {
  const c = cards[i];
  if (c.revealed || c.disabled) return;
  c.reward = generateReward();
  c.revealed = true;

  // disable other cards after one selection (single-select validation)
  cards.forEach((card, idx) => {
    if (idx !== i) card.disabled = true;
  });

  // fire confetti
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#B92B2B", "#FFECB5", "#2B8A3E", "#FFFFFF"],
  };
  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(200 * particleRatio),
      })
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

const pickedCount = computed(() => cards.filter((c) => c.revealed).length);

function sendToTito() {
  const selectedRewards = cards.filter((c) => c.revealed).map((c) => c.reward);
  emit("send-to-tito", {
    isGodchild: props.isGodchild,
    name: props.name,
    gcash: props.gcash,
    selectedRewards,
  });
}
</script>

<style scoped>
.reward-area {
  max-width: 720px;
  margin: 1rem auto;
  padding: 1rem;
  background: linear-gradient(180deg, #fffaf6 0%, #fff 100%);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(20, 20, 30, 0.06);
}
.reward-header {
  text-align: center;
  margin-bottom: 0.8rem;
}
.reward-header h2 {
  color: #b92b2b;
}
.role {
  color: #2b6b2b;
  margin-top: 0.2rem;
  font-size: 0.95rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  perspective: 900px;
}
.card {
  width: 100%;
  padding-top: 100%; /* square */
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: scale(1.05);
}
.card .face {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transition: transform 0.6s ease, box-shadow 0.2s ease;
}
.card .front {
  background: linear-gradient(180deg, #d63636 0%, #901f1f 100%);
  color: #fff;
  transform: rotateY(0deg);
}
.card .front .gift {
  width: 56%;
  height: 56%;
  background: #ffecb5;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 -6px 12px rgba(0, 0, 0, 0.06);
}
.card .front .bow {
  position: absolute;
  left: 50%;
  top: 18%;
  width: 60%;
  height: 14%;
  background: #c11;
  transform: translateX(-50%);
  border-radius: 6px;
}
.card .back {
  background: linear-gradient(180deg, #fefefe 0%, #fff9f2 100%);
  color: #0b3b0b;
  transform: rotateY(180deg);
  border: 2px dashed rgba(0, 0, 0, 0.06);
  font-weight: 700;
}
.card.revealed .front {
  transform: rotateY(180deg);
}
.card.revealed .back {
  transform: rotateY(360deg);
}
.reward-value {
  font-size: 1.15rem;
  color: #b92b2b;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
}
.send {
  background: #2b8a3e;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.picked {
  color: #444;
}

.card.disabled {
  pointer-events: none;
  opacity: 0.46;
  cursor: not-allowed;
}

/* small screens */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gift-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
}
</style>
