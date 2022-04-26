<template>
  <div
    :class="{ hidden: showForm, 'payment-form': true, 'global-spinner': true }"
  >
    <div class="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  <form
    :class="{ hidden: !showForm, 'payment-form': true }"
    @submit="handleSubmit"
  >
    <div class="payment-element" ref="paymentElement">
      <!--Stripe.js injects the Payment Element-->
    </div>
    <button class="submit-payment" :disabled="!canPay">
      <div :class="{ spinner: true, hidden: !isLoading }">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span :class="{ 'button-text': true, hidden: isLoading }">Pay now</span>
    </button>
    <div v-if="errorMessage" class="payment-message">{{ errorMessage }}</div>
  </form>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
// const stripe = await loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  data() {
    return {
      stripe: null,
      error: null,
      submitLoading: false,
      elements: null,
      paymentElement: null,
      paymentElementReady: false,
    };
  },
  computed: {
    isLoading() {
      if (this.isEditMode) {
        return false;
      }
      return (!this.error && !this.stripe) || this.submitLoading;
    },
    canPay() {
      return !this.isLoading && this.paymentElementReady;
    },
    isEditMode() {
      return this.wwEditorState && this.wwEditorState.editMode !== "PREVIEW";
    },
    showForm() {
      return this.paymentElementReady || this.isEditMode;
    },
    errorMessage() {
      if (!this.error) {
        return;
      }
      return this.error.message || "Unexpected error.";
    },
  },
  setup(props) {
    const { setValue: setStripeLoadedValue } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid,
        name: "stripeLoaded",
        type: "boolean",
        defaultValue: false,
      });
    const { setValue: setErrorValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: "error",
      type: "object",
      defaultValue: null,
    });
    return { setStripeLoadedValue, setErrorValue };
  },
  created() {
    this.loadStripeSDK();
  },
  watch: {
    "content.pubKey": function () {
      this.loadStripeSDK();
    },
    "content.clientSecret": function () {
      this.initElements();
    },
    isEditMode: function () {
      this.loadStripeSDK();
    },
    error: function () {
      this.setErrorValue(this.error);
    },
  },
  methods: {
    loadStripeSDK() {
      if (this.isEditMode || this.error || !this.content.pubKey) {
        return;
      }
      if (this.stripe && !this.paymentElementReady) {
        this.initElements();
        return;
      }
      loadStripe(this.content.pubKey)
        .then((stripe) => {
          this.stripe = stripe;
          this.setStripeLoadedValue(true);
          console.log("stripe loaded");
          this.initElements();
        })
        .catch((error) => {
          console.error(error);
          this.error = error;
          this.$emit("trigger-event", {
            name: "throwError",
            event: { value: error.message },
          });
        });
    },
    setElementReady() {
      this.paymentElementReady = true;
      console.log("elements ready");
    },
    initElements() {
      if (this.isEditMode) {
        return;
      }
      if (!this.stripe || !this.content.clientSecret) {
        return;
      }
      const appearance = {
        theme: "stripe",
      };
      const elements = this.stripe.elements({
        appearance,
        clientSecret: this.content.clientSecret,
      });
      this.elements = elements;

      const paymentElement = elements.create("payment");
      this.paymentElement = paymentElement;
      paymentElement.on("ready", this.setElementReady);
      paymentElement.mount(this.$refs.paymentElement);
    },
    async handleSubmit(e) {
      e.preventDefault();
      if (this.isEditMode) {
        return;
      }
      this.submitLoading = true;
      this.error = undefined;

      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: this.content.returnUrl,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      console.error(error);
      if (error.type === "card_error" || error.type === "validation_error") {
        this.error = error;
        this.$emit("trigger-event", {
          name: "throwError",
          event: { value: error.message },
        });
      } else {
        this.error = { message: "An unexpected error occured." };
        this.$emit("trigger-event", {
          name: "throwError",
          event: { value: "An unexpected error occured." },
        });
      }

      this.submitLoading = false;
    },
  },
};
</script>

<style lang="css" scoped>
.payment-form {
  width: 30vw;
  min-width: 500px;
  align-self: center;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
  padding: 40px;
  background-color: #fff;
}

.payment-message {
  color: rgb(105, 115, 134);
  font-size: 16px;
  line-height: 20px;
  padding-top: 12px;
  text-align: center;
}

.payment-element {
  margin-bottom: 24px;
}

/* Buttons and links */
.submit-payment {
  background: #5469d4;
  font-family: Arial, sans-serif;
  color: #ffffff;
  border-radius: 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
.submit-payment:hover {
  filter: contrast(115%);
}
.submit-payment:disabled {
  opacity: 0.5;
  cursor: default;
}

.spinner {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}
.spinner div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 0;
  border: 2px solid #fff;
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.spinner div:nth-child(1) {
  animation-delay: -0.45s;
}
.spinner div:nth-child(2) {
  animation-delay: -0.3s;
}
.spinner div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.global-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.global-spinner .spinner div {
  border: 2px solid gray;
  border-color: gray transparent transparent transparent;
}

@media only screen and (max-width: 600px) {
  .payment-form {
    width: 80vw;
    min-width: initial;
  }
}

.hidden {
  display: none;
}
</style>
