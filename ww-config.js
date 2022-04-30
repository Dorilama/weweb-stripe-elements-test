export default {
  editor: {
    label: {
      en: "Stripe Elements Test",
    },
  },
  triggerEvents: [],
  properties: {
    pubKeyLive: {
      label: { en: "LIVE publishable key" },
      type: "Text",
      section: "settings",
      hidden: true, // TODO figure out how to detect live env and use this
    },
    pubKeyTest: {
      label: { en: "TEST publishable key" },
      type: "Text",
      section: "settings",
      defaultValue:
        "pk_test_51IoOr3GCtjJ66aX6cVqfuXaDeMT2fp3yCI63qVx8HcfxGxM4QrAQbSGHYm2Rb0BXJJ58hOWxtIM3g6AOK89Jnl2k00fris7cqS",
    },
    clientSecret: {
      label: { en: "Client secret from payment intent" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue:
        "pi_3KuJxbGCtjJ66aX61udk3R7n_secret_lQFnsY4VhFEYm4TCS5A5w8S0W",
    },
    returnUrl: {
      label: { en: "Return url" },
      type: "Text",
      section: "settings",
      bindable: true,
      defaultValue:
        "https://editor-dev.weweb.io/e618bd81-195e-46c7-8d97-7f393d6b8ebb",
    },
    submitButton: {
      hidden: true,
      defaultValue: {
        isWwObject: true,
        type: "ww-button",
        content: {
          text: "Pay now",
          fontWeight: 600,
          textAlign: "center",
          color: "#ffffff",
          buttonType: "submit",
          // TODO choose how to handle icons
        },
        state: {
          states: ["disabled", "loading"],
          style: {
            default: {
              backgroundColor: "#5469d4",
              borderRadius: "4px",
              border: 0,
              padding: "12px 16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0px 4px 5.5px 0px rgba(0, 0, 0, 0.07)",
              width: "100%",
            },
            disabled_default: {
              opacity: 0.5,
              cursor: "default",
            },
            ":hover_default": {
              customCss: { filter: "brightness(120%) saturate(120%)" },
            },
            loading_default: {},
          },
        },
      },
    },
    errorText: {
      hidden: true,
      defaultValue: {
        isWwObject: true,
        type: "ww-text",
        content: {
          text: "An unknown error occurred",
          color: "#697386",
          fontSize: "16px",
          lineHeight: "20px",

          textAlign: "center",
        },
        state: {
          states: ["error"],
          style: {
            default: {
              padding: "12px 0 0 0",
              display: false,
            },
            error_default: { display: true },
          },
        },
      },
    },
  },
};
