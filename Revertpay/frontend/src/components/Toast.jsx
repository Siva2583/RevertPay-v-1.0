import Icon from "./Icon";

function Toast({ toast, closeToast }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type}`}>
      <div className="toast-mark">
        {toast.type === "success" ? "✓" : "!"}
      </div>

      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>

      <button onClick={closeToast} aria-label="Close notification">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default Toast;