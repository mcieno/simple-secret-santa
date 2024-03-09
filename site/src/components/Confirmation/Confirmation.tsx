import "./Confirmation.css";

interface Props {
  confirmText: string;
  dismissText: string;
  fnOnConfirm: () => void;
  fnOnDismiss: () => void;
}

export default function Confirmation(props: Props) {
  return (
    <div class="Confirmation">
      <input
        name="yes"
        type="submit"
        value={props.confirmText}
        onClick={() => props.fnOnConfirm()}
      />
      <input
        name="no"
        type="submit"
        value={props.dismissText}
        onClick={() => props.fnOnDismiss()}
      />
    </div>
  );
}
