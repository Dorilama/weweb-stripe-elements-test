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
    },
    clientSecret: {
      label: { en: "Client secret from payment intent" },
      type: "Text",
      section: "settings",
      bindable: true,
    },
    returnUrl: {
      label: { en: "Return url" },
      type: "Text",
      section: "settings",
      bindable: true,
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
          states: ["disabled"],
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
    globalLoad: {
      hidden: true,
      defaultValue: {
        isWwObject: true,
        type: "ww-icon",
        content: {
          icon: "fa fa-spinner fa-spin",
          color: "#5469d4",
          fontSize: 50,
        },
        state: {
          states: ["loading"],
          style: {
            default: {
              padding: "20px",
              display: false,
            },
            loading_default: { display: true },
          },
        },
      },
    },
  },
};
