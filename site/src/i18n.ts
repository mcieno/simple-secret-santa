const Languages = {
  __: "OVERRIDE",
  en: "English",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  de: "Deutsch",
};

type Language = keyof typeof Languages;

const DefaultLang: Language = "en";
const Lang: Language = import.meta.env.PUBLIC_I18N_LANGUAGE || DefaultLang;

const I18N = {
  __: {
    "html.title":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_HTML_TITLE as string) || null,
    "code.prompt":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_CODE_PROMPT as string) || null,
    "code.invalid":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_CODE_INVALID as string) || null,
    "user.hi": (import.meta.env.PUBLIC_I18N_OVERRIDE_USER_HI as string) || null,
    "user.who":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_USER_WHO as string) || null,
    "user.back":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_USER_BACK as string) || null,
    "santa.present":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_SANTA_PRESENT as string) || null,
    "santa.extra":
      (import.meta.env.PUBLIC_I18N_OVERRIDE_SANTA_EXTRA as string) || null,
  },
  en: {
    "html.title": `Simple Secret Santa`,
    "code.prompt": `What's your code?`,
    "code.invalid": `Invalid code :/`,
    "user.hi": `Hi`,
    "user.who": `Who's my santa?`,
    "user.back": `Go back!`,
    "santa.present": `Make a present to`,
    "santa.extra": ``,
  },
  es: {
    "html.title": `Amigo Invisible`,
    "code.prompt": `Introduzca el código`,
    "code.invalid": `Código invalido :/`,
    "user.hi": `Hola`,
    "user.who": `Descubre a quién te toca`,
    "user.back": `Regresar!`,
    "santa.present": `Haz un regalo a`,
    "santa.extra": ``,
  },
  fr: {
    "html.title": `Père Noël Secret`,
    "code.prompt": `Quel est ton code?`,
    "code.invalid": `Code invalide :/`,
    "user.hi": `Coucou`,
    "user.who": `Qui est mon santa?`,
    "user.back": `Retour!`,
    "santa.present": `Offre un cadeau à`,
    "santa.extra": ``,
  },
  it: {
    "html.title": `Babbo Segreto`,
    "code.prompt": `Inserisci il codice`,
    "code.invalid": `Codice non valido :/`,
    "user.hi": `Ciao`,
    "user.who": `Scopri chi hai pescato`,
    "user.back": `Torna indietro!`,
    "santa.present": `Fai un regalo a`,
    "santa.extra": ``,
  },
  de: {
    "html.title": `Wichteln`,
    "code.prompt": `Was ist dein Code?`,
    "code.invalid": `Ungültiger Code :/`,
    "user.hi": `Hallo`,
    "user.who": `Wen muss ich beschenken?`,
    "user.back": `Zurück!`,
    "santa.present": `Gib ein Geschenk an`,
    "santa.extra": ``,
  },
} as const;

export default function (key: keyof (typeof I18N)[Language]): string {
  return I18N.__[key] ?? I18N[Lang][key] ?? I18N[DefaultLang][key] ?? key;
}
