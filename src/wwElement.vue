<template>
  <form @submit.prevent="handleSubmit">
    <wwElement
      :states="elementReady ? [] : ['loading']"
      v-bind="content.globalLoad"
    ></wwElement>
    <div ref="paymentElement" class="payment-element"></div>
    <wwElement
      v-bind="content.submitButton"
      :states="canPay ? [] : ['disabled']"
    ></wwElement>
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
    return {
      stripe: null,
      elements: null,
      error: null,
      loading: false,
      elementReady: false,
    };
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
    canPay() {
      return !this.loading;
    },
    updatableOptions() {
      // TODO add variables to appearence and rules
      const options = {
        locale: this.content.locale || "auto",
        appearance: {
          theme: this.content.theme || "stripe",
          labels: this.content.labels,
        },
        clientSecret: this.content.clientSecret,
      };

      if (this.content.variables) {
        options.appearance.variables = Object.fromEntries(
          this.content.variables.map(({ key, value } = {}) => {
            if (key) {
              return [key, value];
            }
            return [];
          })
        );
      }

      if (this.content.rules) {
        options.appearance.rules = Object.fromEntries(
          this.content.rules.map(({ selector, props } = {}) => {
            if (selector && props) {
              const allProps = Object.fromEntries(
                props.map(({ key, value } = {}) => {
                  if (key) {
                    return [key, value];
                  }
                  return [];
                })
              );

              return [selector, allProps];
            }
            return [];
          })
        );
      }

      // TODO log rules and variables in edit mode
      return options;
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
    error: {
      handler() {
        if (!this.error) {
          return;
        }
        this.sendMessage("error", this.error);
      },
    },
    updatableOptions: {
      handler() {
        this.updateElements();
      },
      deep: true,
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
        loader: this.content.loader || "auto",
        ...this.updatableOptions,
      };

      this.elements = this.stripe.elements(options);
      const paymentElement = this.elements.create("payment");
      const setReady = this.setElementReady;
      paymentElement.on("ready", () => {
        setReady(true);
      });
      paymentElement.mount(this.$refs.paymentElement);
    },
    setElementReady(value) {
      this.elementReady = value;
    },
    async handleSubmit() {
      if (!this.stripe || !this.elements) {
        return;
      }
      if (!this.content.returnUrl) {
        // TODO warn about missing prop when in dev mode
        return;
      }
      this.loading = true;
      this.error = null;
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: this.content.returnUrl,
        },
      });
      this.loading = false;
      if (error) {
        this.error = error;
      } else {
        // TODO log the error in dev mode only
        console.log(error);
        this.error = new Error("An unexpected error occured.");
      }
    },
    updateElements() {
      if (this.elements) {
        this.elements.update(this.updatableOptions);
      } else {
        this.createElement();
      }
    },
  },
};
</script>

<style lang="css" scoped>
.payment-element {
  margin-bottom: 24px;
}
</style>
