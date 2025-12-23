import {
  createMemo,
  createRenderEffect,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";

import "./Draw.css";

import Confirmation from "~/components/Confirmation/Confirmation.tsx";
import Pincode from "~/components/Pincode/Pincode.tsx";

import i18n from "~/i18n";

interface Props {
  draws: { code: string; from: string; to: string }[];
}

let RefForm: HTMLFormElement;
let RefSubmit: HTMLInputElement;

export default function Draws(props: Props) {
  const [code, setCode] = createSignal<string>("");
  const [confirm, setConfirm] = createSignal<boolean>(false);
  const pair = createMemo(
    () => props.draws?.find((draw) => draw.code === code()) ?? null,
  );

  // Check for code in URL parameters on mount
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get("code");
    if (urlCode && urlCode.length === 6) {
      setCode(urlCode);
    }
  });

  createRenderEffect(() => {
    if (code()) {
      RefForm.dispatchEvent(new SubmitEvent("submit"));
    }
  });

  return (
    <div class="Draw">
      <Switch>
        <Match when={pair() && confirm()}>
          <h1>🎁 {i18n("santa.present")} 🎁</h1>
          <h2>{pair()!.to}</h2>
          <Show when={i18n("santa.extra")}>
            <h3>{i18n("santa.extra")}</h3>
          </Show>
        </Match>
        <Match when={pair() && !confirm()}>
          <h1>
            {i18n("user.hi")} {pair()!.from}
          </h1>
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <Confirmation
              confirmText={`🎁  ${i18n("user.who")}`}
              dismissText={`\u276E  ${i18n("user.back")}`}
              fnOnConfirm={() => setConfirm(true)}
              fnOnDismiss={() => setCode("")}
            />
          </form>
        </Match>
        <Match when={!pair()}>
          <h1>{i18n("code.prompt")}</h1>
          <form
            ref={RefForm}
            onSubmit={(e) => {
              e.preventDefault();

              console.debug({
                message: "submit pincode form",
                event: e,
                code: code(),
                pair: pair(),
              });

              if (!pair()) {
                RefSubmit.setCustomValidity(i18n("code.invalid"));
                RefSubmit.reportValidity();
                setTimeout(() => {
                  RefSubmit.setCustomValidity("");
                }, 500);
              }
            }}
            action="#"
            novalidate
          >
            <Pincode length={6} fnOnInput={setCode} />
            <input ref={RefSubmit} type="submit" hidden />
          </form>
        </Match>
      </Switch>
    </div>
  );
}
