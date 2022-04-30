<template></template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return { stripe: null };
  },
  computed: {
    pubKey() {
      // TODO figure out how to detect live app
      return this.content.pubKeyTest;
    },
  },
  watch: {
    pubKey: {
      async handler() {
        if (!this.pubKey) {
          return;
        }
        try {
          this.stripe = await loadStripe(this.pubKey);
        } catch (e) {
          this.sendMessage("error", e);
        }
      },
      immediate: true,
    },
  },
  methods: {
    sendMessage({ mode, obj }) {
      // TODO send message back to app
    },
  },
};
</script>

<style lang="css" scoped></style>
