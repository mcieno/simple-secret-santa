import {
  createMemo,
  createRenderEffect,
  createSignal,
  For,
  type Accessor,
  type Signal,
} from "solid-js";

import "./Pincode.css";

interface Props {
  length: number;
  legend?: string;
  name?: string;
  fnOnInput: (value: string) => void;
}

export default function Pincode(props: Props) {
  const cells = Array.from({ length: props.length }, () =>
    createSignal<string>(""),
  );

  const code = createMemo(() => cells.map(([cell, _]) => cell()).join(""));
  createRenderEffect(() => {
    const pincode = code();
    if (pincode.length === props.length) {
      props.fnOnInput(pincode);
    }
  });

  return (
    <div class="Pincode">
      <fieldset
        name={props.name ?? "pin"}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;

          if (!target.value) {
            return;
          }

          if (target.nextElementSibling) {
            (target.nextElementSibling as HTMLInputElement).focus();
            return;
          }
        }}
        onKeyDown={(e) => {
          const key = e.key;
          if (key !== "Backspace" && key !== "Delete") {
            return;
          }

          const target = e.target as HTMLInputElement;
          if (!target.value) {
            (target.previousElementSibling as HTMLInputElement | null)?.focus();
          }
        }}
      >
        <legend>
          {props.legend || `Insert your ${props.length}-digit PIN code`}
        </legend>
        <For each={cells}>
          {([cell, setCell], i) => (
            <>
              <input
                use:model={[cell, setCell]}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData?.getData("text") ?? "";

                  // When pasting over an already set code, every
                  // updated cell will trigger make a new `code`,
                  // resulting in `fnOnInput` being called
                  // repeatedly for every letter.
                  // To prevent this, let's unset cells first.
                  Array.from(pasted).forEach((_, j) => {
                    if (i() + j >= cells.length) {
                      return;
                    }

                    const [__, set] = cells[i() + j];
                    set("");
                  });

                  let currentFocus: HTMLInputElement = e.currentTarget;
                  Array.from(pasted).forEach((letter, j) => {
                    if (i() + j >= cells.length) {
                      return;
                    }

                    const [_, set] = cells[i() + j];
                    set(letter);

                    if (currentFocus.nextElementSibling) {
                      currentFocus =
                        currentFocus.nextElementSibling as HTMLInputElement;
                      currentFocus.focus();
                    }
                  });
                }}
                autocomplete={i() === 0 ? "one-time-code" : "off"}
                type="text"
                maxlength="1"
                pattern="[0-9]"
              />
            </>
          )}
        </For>
      </fieldset>
    </div>
  );
}

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      model: typeof model;
    }
  }
}

function model(
  element: HTMLInputElement,
  accessor: Accessor<Signal<string>>,
): void {
  const [field, setField] = accessor();
  createRenderEffect(() => (element.value = field()));
  element.addEventListener("input", ({ currentTarget }) =>
    setField((currentTarget as HTMLInputElement).value),
  );
}
