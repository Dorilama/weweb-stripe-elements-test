<template>
  <form @submit.prevent="handleSubmit">
    <div ref="paymentElement">
      <!-- Elements will create form elements here -->
    </div>
    <wwElement v-bind="content.submitButton"></wwElement>
    <wwElement
      :states="errorMessage ? ['error'] : []"
      v-bind="content.errorText"
      :ww-props="{ text: errorMessage }"
    ></wwElement>
  </form>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return { stripe: null, elements: null, error: null };
  },
  computed: {
    pubKey() {
      // TODO figure out how to detect live app
      return this.content.pubKeyTest;
    },
    errorMessage() {
      if (!this.error) {
        return;
      }
      return this.error.message || "An unknown error occurred";
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
        } catch (error) {
          this.sendMessage("error", error);
        }
        this.createElement();
      },
      immediate: true,
    },
    "content.clientSecret": {
      handler() {
        this.createElement();
      },
    },
    error: {
      handler() {
        if (!this.error) {
          return;
        }
        this.sendMessage("error", this.error);
      },
    },
  },
  methods: {
    sendMessage(mode, obj) {
      // TODO send message back to app
    },
    createElement() {
      if (!this.stripe || !this.content.clientSecret) {
        return;
      }
      const options = {
        clientSecret: this.content.clientSecret,
        // TODO add appearence options
        appearance: {},
      };

      this.elements = this.stripe.elements(options);
      const paymentElement = this.elements.create("payment");
      paymentElement.mount(this.$refs.paymentElement);
    },
    async handleSubmit() {
      if (!this.stripe || !this.elements) {
        return;
      }
      if (!this.content.returnUrl) {
        // TODO warn ablout missing prop when in dev mode
        return;
      }
      this.error = null;
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: this.content.returnUrl,
        },
      });

      if (error) {
        this.error = error;
      } else {
        // TODO log the error in dev mode only
        console.log(error);
        this.error = new Error("An unexpected error occured.");
      }
    },
  },
};
</script>

<style lang="css" scoped></style>
