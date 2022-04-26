export default {
  editor: {
    label: {
      en: "Stripe Elements Test",
    },
  },
  triggerEvents: [
    {
      name: "stripeLoaded",
      label: { en: "On Stripe loaded" },
      event: { value: "" },
    },
    {
      name: "throwError",
      label: { en: "On Error" },
      event: { value: "" },
    },
  ],
  properties: {
    pubKey: {
      label: {
        en: "Publishable Key",
      },
      type: "Text",
      defaultValue: "",
    },
    clientSecret: {
      label: {
        en: "PaymentIntent client secret",
      },
      type: "Text",
      defaultValue: "",
      bindable: true,
    },
    returnUrl: {
      label: {
        en: "Return Url",
      },
      type: "Text",
      defaultValue: "",
      bindable: true,
    },
    stripeLoaded: {
      label: {
        en: "stripe loaded",
      },
      type: "OnOff",
      hidden: true,
    },
    error: {
      label: {
        en: "error",
      },
      type: "Object",
      hidden: true,
    },
  },
};
