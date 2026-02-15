export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
    >
      {children}
    </button>
  );
}
