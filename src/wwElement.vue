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
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
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
    isLive() {
      // TODO is this good enough?
      const editors = ["editor-dev.weweb.io", "editor.weweb.io"];
      return !editors.includes(location.host);
    },
    pubKey() {
      return this.isLive ? this.content.pubKeyLive : this.content.pubKeyTest;
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
        if (!this.isLive) {
          console.log("variables", options.appearance.variables);
        }
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
        if (!this.isLive) {
          console.log("rules", options.appearance.rules);
        }
      }

      return options;
    },
    /* wwEditor:start */
    buttonType() {
      const uid = this.content.submitButton && this.content.submitButton.uid;
      if (!uid) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(uid);
      return obj.content.default.buttonType;
    },
    link() {
      const uid = this.content.submitButton && this.content.submitButton.uid;
      if (!uid) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(uid);
      return obj._state.link && obj._state.link.type;
    },
    /* wwEditor:end */
  },
  watch: {
    pubKey: {
      async handler() {
        if (!this.pubKey) {
          return;
        }
        const options = {};
        if (this.content.apiVersion) {
          // TODO warn abour necessary reload in editor
          options.apiVersion = this.content.apiVersion;
        }

        if (!this.content.fraud) {
          loadStripe.setLoadParameters({ advancedFraudSignals: false });
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
    /* wwEditor:start */
    "wwEditorState.editMode"() {
      if (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.PREVIEW
      ) {
        if (!this.content.returnUrl) {
          wwLib.wwNotification.open({
            text: {
              en: `Stripe Element Test - Missing parameter "Return Url"`,
            },
            color: "purple",
            duration: 3000,
          });
        }
        if (
          !this.content.pubKeyLive ||
          !this.content.pubKeyLive.startsWith("pk_live")
        ) {
          wwLib.wwNotification.open({
            text: {
              en: `Stripe Element Test - LIVE public key not correct. It should start with "pk_live"`,
            },
            color: "purple",
            duration: 3000,
          });
        }
        if (
          !this.content.pubKeyTest ||
          !this.content.pubKeyTest.startsWith("pk_test")
        ) {
          wwLib.wwNotification.open({
            text: {
              en: `Stripe Element Test - TEST public key not correct It should start with "pk_test"`,
            },
            color: "purple",
            duration: 3000,
          });
        }
      }
    },
    buttonType(value) {
      if (value === "submit" || value === undefined) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(
        this.content.submitButton.uid
      );
      obj.content.default.buttonType = "submit";
      wwLib.wwNotification.open({
        text: {
          en: 'The pay button must be of type "Submit Button"',
        },
        color: "purple",
        duration: 3000,
      });
    },
    link(value) {
      if (value === "none" || value === undefined) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(
        this.content.submitButton.uid
      );
      obj._state.link = { type: "none" };
      wwLib.wwNotification.open({
        text: {
          en: `The pay button can't link`,
        },
        color: "purple",
        duration: 3000,
      });
    },
    /* wwEditor:end */
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
        console.error(`Stripe Element Test - Missing parameter "Return Url"`);
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
