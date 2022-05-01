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
                type: "Text",
                options: { placeholder: "Variable name" },
              },
              value: {
                label: { en: "Value" },
                type: "Text",
                options: { placeholder: "Value" },
              },
            },
          },
        },
      },
    },
    locale: {
      label: { en: "Locale" },
      type: "TextSelect",
      bindable: true,
      section: "settings",
      defaultValue: "auto",
      bindable: true,
      options: {
        options: [
          {
            value: "auto",
            label: {
              en: "Auto-detect",
            },
          },
          {
            value: "ar",
            label: {
              en: "Arabic",
            },
          },
          {
            value: "bg",
            label: {
              en: "Bulgarian (Bulgaria)",
            },
          },
          {
            value: "cs",
            label: {
              en: "Czech (Czech Republic)",
            },
          },
          {
            value: "da",
            label: {
              en: "Danish (Denmark)",
            },
          },
          {
            value: "de",
            label: {
              en: "German (Germany)",
            },
          },
          {
            value: "el",
            label: {
              en: "Greek (Greece)",
            },
          },
          {
            value: "en",
            label: {
              en: "English",
            },
          },
          {
            value: "en-GB",
            label: {
              en: "English (United Kingdom)",
            },
          },
          {
            value: "es",
            label: {
              en: "Spanish (Spain)",
            },
          },
          {
            value: "es-419",
            label: {
              en: "Spanish (Latin America)",
            },
          },
          {
            value: "et",
            label: {
              en: "Estonian (Estonia)",
            },
          },
          {
            value: "fi",
            label: {
              en: "Finnish (Finland)",
            },
          },
          {
            value: "fil",
            label: {
              en: "Filipino (Philipines)",
            },
          },
          {
            value: "fr",
            label: {
              en: "French (France)",
            },
          },
          {
            value: "fr-CA",
            label: {
              en: "French (Canada)",
            },
          },
          {
            value: "he",
            label: {
              en: "Hebrew (Israel)",
            },
          },
          {
            value: "hr",
            label: {
              en: "Croatian (Croatia)",
            },
          },
          {
            value: "hu",
            label: {
              en: "Hungarian (Hungary)",
            },
          },
          {
            value: "id",
            label: {
              en: "Indonesian (Indonesia)",
            },
          },
          {
            value: "it",
            label: {
              en: "Italian (Italy)",
            },
          },
          {
            value: "ja",
            label: {
              en: "Japanese (Japan)",
            },
          },
          {
            value: "ko",
            label: {
              en: "Korean (Korea)",
            },
          },
          {
            value: "lt",
            label: {
              en: "Lithuanian (Lithuania)",
            },
          },
          {
            value: "lv",
            label: {
              en: "Latvian (Latvia)",
            },
          },
          {
            value: "ms",
            label: {
              en: "Malay (Malaysia)",
            },
          },
          {
            value: "mt",
            label: {
              en: "Maltese (Malta)",
            },
          },
          {
            value: "nb",
            label: {
              en: "Norwegian Bokmål",
            },
          },
          {
            value: "nl",
            label: {
              en: "Dutch (Netherlands)",
            },
          },
          {
            value: "pl",
            label: {
              en: "Polish (Poland)",
            },
          },
          {
            value: "pt-BR",
            label: {
              en: "Portuguese (Brazil)",
            },
          },
          {
            value: "pt",
            label: {
              en: "Portuguese (Brazil)",
            },
          },
          {
            value: "ro",
            label: {
              en: "Romanian (Romania)",
            },
          },
          {
            value: "ru",
            label: {
              en: "Russian (Russia)",
            },
          },
          {
            value: "sk",
            label: {
              en: "Slovak (Slovakia)",
            },
          },
          {
            value: "sl",
            label: {
              en: "Slovenian (Slovenia)",
            },
          },
          {
            value: "sv",
            label: {
              en: "Swedish (Sweden)",
            },
          },
          {
            value: "th",
            label: {
              en: "Thai (Thailand)",
            },
          },
          {
            value: "tr",
            label: {
              en: "Turkish (Turkey)",
            },
          },
          {
            value: "vi",
            label: {
              en: "Vietnamese (Vietnam)",
            },
          },
          {
            value: "zh",
            label: {
              en: "Chinese Simplified (China)",
            },
          },
          {
            value: "zh-HK",
            label: {
              en: "Chinese Traditional (Hong Kong)",
            },
          },
          {
            value: "zh-TW",
            label: {
              en: "Chinese Traditional (Taiwan)",
            },
          },
        ],
      },
    },
    loader: {
      label: { en: "Elements loader" },
      type: "TextSelect",
      section: "settings",
      options: {
        options: [
          { value: "auto", label: { en: "auto" } },
          { value: "always", label: { en: "always" } },
          { value: "never", label: { en: "never" } },
        ],
      },
      defaultValue: "auto",
    },
    // TODO prevent selectiong different buttonType and adding link behaviour
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
        state: {
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
  },
};
