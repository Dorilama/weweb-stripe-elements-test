import { localeOptions, variablesOptions } from "./options.js";
export default {
  editor: {
    label: {
      en: "Stripe Elements Test",
    },
    icon: "fontawesome/solid/dollar-sign",
    bubble: {
      icon: "fontawesome/solid/dollar-sign",
    },
  },
  triggerEvents: [
    {
      name: "ready",
      label: { en: "On Element Ready" },
    },
    {
      name: "loading:start",
      label: { en: "On loading start" },
    },
    {
      name: "loading:end",
      label: { en: "On loading end" },
    },
    ,
    {
      name: "error",
      label: { en: "On new error" },
    },
  ],
  properties: {
    pubKeyLive: {
      label: { en: "LIVE publishable key" },
      type: "Text",
      section: "settings",
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
    theme: {
      label: { en: "Theme" },
      type: "TextSelect",
      bindable: "true",
      options: {
        options: [
          { value: "stripe", label: { en: "stripe" } },
          { value: "night", label: { en: "night" } },
          { value: "flat", label: { en: "flat" } },
          { value: "none", label: { en: "none" } },
        ],
      },
      defaultValue: "stripe",
    },
    variables: {
      label: { en: "Variables" },
      type: "Array",
      bindable: "true",
      options: {
        item: {
          type: "Object",
          options: {
            item: {
              key: {
                label: { en: "Name" },
                type: "TextSelect",
                bindable: true,
                options: {
                  options: variablesOptions,
                },
              },
              value: {
                label: { en: "Value" },
                type: "Text",
                bindable: true,
                options: { placeholder: "Value" },
              },
            },
          },
        },
      },
    },
    rules: {
      label: { en: "Rules" },
      type: "Array",
      bindable: "true",
      options: {
        item: {
          type: "Object",
          options: {
            item: {
              selector: {
                label: { en: "Selector" },
                type: "Text",
                options: { placeholder: "Selector rule" },
              },
              props: {
                label: { en: "Properties" },
                type: "Array",
                options: {
                  item: {
                    type: "Object",
                    options: {
                      item: {
                        key: {
                          label: { en: "Name" },
                          type: "Text",
                          options: { placeholder: "Property name" },
                        },
                        value: {
                          label: { en: "Value" },
                          type: "Text",
                          options: { placeholder: "Property value" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    labels: {
      label: { en: "Labels" },
      type: "TextSelect",
      bindable: "true",
      options: {
        options: [
          { value: "above", label: { en: "above" } },
          { value: "floating", label: { en: "floating" } },
        ],
      },
      defaultValue: "above",
    },
    locale: {
      label: { en: "Locale" },
      type: "TextSelect",
      bindable: true,
      section: "settings",
      defaultValue: "auto",
      bindable: true,
      options: {
        options: localeOptions,
      },
    },
    loader: {
      label: { en: "Elements loader" },
      type: "TextSelect",
      options: {
        options: [
          { value: "auto", label: { en: "auto" } },
          { value: "always", label: { en: "always" } },
          { value: "never", label: { en: "never" } },
        ],
      },
      defaultValue: "auto",
    },
    apiVersion: {
      label: { en: "Override Api Version" },
      type: "Text",
      section: "settings",
      hidden: (content) => false,
    },
    fraud: {
      label: { en: "Enable Advanced Fraud Signals" },
      type: "OnOff",
      section: "settings",
      defaultValue: true,
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
        },
        // defining state here is not supported and may break at any time
        // you shoult set style with weweb design system
        state: {
          name: "pay button",
          states: ["disabled"],
          style: {
            default: {
              backgroundColor: "#5469d4",
              borderRadius: "4px",
              border: 0,
              padding: "12px 16px",
              margin: "24px 0px 0px 0px",
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
        // defining state here is not supported and may break at any time
        // you shoult set style with weweb design system
        state: {
          name: "error text",
          states: ["error"],
          style: {
            default: {
              padding: "12px 0 0 0",
              display: false,
              transition: "all 0.2s ease",
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
        // defining state here is not supported and may break at any time
        // you shoult set style with weweb design system
        state: {
          name: "loader icon",
          states: ["loading"],
          style: {
            default: {
              padding: "20px",
              display: false,
              transition: "all 0.2s ease",
            },
            loading_default: { display: true },
          },
        },
      },
    },
    showError: {
      label: {
        en: "Show error text",
      },
      type: "OnOff",
      editorOnly: true,
    },
  },
};
