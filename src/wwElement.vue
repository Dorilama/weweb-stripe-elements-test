<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="showOverlay" class="overlay">
      <p>{{ editorErrorMessage }}</p>
    </div>
    <wwElement
      :states="elementReady ? [] : ['loading']"
      v-bind="content.globalLoad"
    ></wwElement>
    <div ref="paymentElement" class="payment-element"></div>
    <wwElement
      v-bind="content.submitButton"
      :states="canPay ? [] : ['disabled']"
      :disabled="!canPay"
    ></wwElement>
    <wwElement
      v-if="errorMessage"
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
    let isLive = true;
    /* wwEditor:start */
    isLive = false;
    /* wwEditor:end */

    return {
      isLive,
      error: null,
      loading: false,
      elementReady: false,
      /* wwEditor:start */
      styleError: "",
      /* wwEditor:end */
    };
  },
  emits: ["trigger-event", "update:content"],
  computed: {
    pubKey() {
      return this.isLive ? this.content.pubKeyLive : this.content.pubKeyTest;
    },
    errorMessage() {
      let message;
      if (this.error) {
        message = this.error.message || "An unknown error occurred";
      }
      /* wwEditor:start */
      if (this.wwEditorState.sidepanelContent.showError) {
        message = "This is the error text";
      }
      /* wwEditor:end */
      return message;
    },
    canPay() {
      return this.content.returnUrl && !this.loading && !this.isEditor;
    },
    updatableOptions() {
      /* wwEditor:start */
      this.styleError = "";
      /* wwEditor:end */
      const options = {
        locale: this.content.locale || "auto",
        appearance: {
          theme: this.content.theme || "stripe",
          labels: this.content.labels,
        },
        clientSecret: this.content.clientSecret,
      };

      try {
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
      } catch (e) {
        console.error(e);
        /* wwEditor:start */
        this.styleError = "Appearance error:\n" + e.message;
        /* wwEditor:end */
      }

      return options;
    },
    isEditor() {
      let value = false;
      /* wwEditor:start */
      this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
      /* wwEditor:end */

      return value;
    },
    /* wwEditor:start */
    isPreview() {
      return (
        this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.PREVIEW
      );
    },
    buttonTypeOK() {
      const uid = this.content.submitButton && this.content.submitButton.uid;
      if (!uid) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(uid);
      return obj.content.default.buttonType == "submit";
    },
    linkOK() {
      const uid = this.content.submitButton && this.content.submitButton.uid;
      if (!uid) {
        return;
      }
      const obj = wwLib.wwElementHelper.getWwObject(uid);
      const allowed = [undefined, "none"];
      return !obj._state.link || allowed.includes(obj._state.link.type);
    },
    liveKeyOK() {
      return (
        this.content.pubKeyLive && this.content.pubKeyLive.startsWith("pk_live")
      );
    },
    testKeyOK() {
      return (
        this.content.pubKeyTest && this.content.pubKeyTest.startsWith("pk_test")
      );
    },
    returnUrlOK() {
      return !!this.content.returnUrl;
    },
    editorErrors() {
      const errors = [];
      if (!this.buttonTypeOK) {
        errors.push(
          'The pay button shoul be of type "Submit Button". Select it from the element list to correct this error.'
        );
      }
      if (!this.linkOK) {
        errors.push(
          "The pay button should not link to any page. Select it from the element list to correct this error."
        );
      }
      if (!this.liveKeyOK) {
        errors.push('The live key should start with "pk_live"');
      }
      if (!this.testKeyOK) {
        errors.push('The test key should start with "pk_test"');
      }
      if (!this.returnUrlOK) {
        errors.push("The return url should not be empty");
      }
      return errors;
    },
    editorErrorMessage() {
      return `Error:
      ${this.editorErrors.join("\n")}
      ${this.styleError}`;
    },
    showOverlay() {
      return !!this.editorErrors.length || this.styleError;
    },
    /* wwEditor:end */
  },
  watch: {
    pubKey: {
      async handler(value, oldVal) {
        if (!value || value == oldVal) {
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
  },
  methods: {
    sendMessage(mode, obj) {
      this.$emit("trigger-event", {
        name: "error",
        event: { value: this.errorMessage },
      });
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
      this.elementReady = true;
      paymentElement.on("ready", () => {
        this.$emit("trigger-event", {
          name: "ready",
        });
      });
      paymentElement.mount(this.$refs.paymentElement);
    },
    async handleSubmit() {
      if (!this.stripe || !this.elements || !this.canPay) {
        return;
      }
      this.loading = true;
      this.error = null;
      this.$emit("trigger-event", {
        name: "loading:start",
      });
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
      this.$emit("trigger-event", {
        name: "loading:end",
      });
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
/* wwEditor:start */
.overlay {
  width: 100%;
  height: 100%;
  max-height: 100px;
  overflow: auto;
  color: black;
  font-size: 18px;
  font-weight: bold;
  background-color: rgb(241, 187, 187);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
  z-index: 1;
  padding: 20px;
  white-space: pre-line;
}
.parent {
  position: relative;
}
/* wwEditor:end */
</style>
