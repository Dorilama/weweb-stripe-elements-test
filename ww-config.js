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
  },
};
