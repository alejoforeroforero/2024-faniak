export default function SnackbarWithActions({ text, children }) {
  return (
    <div style={{ display: "flex" }}>
      {text}
      <div style={{ flexGrow: 1 }}></div>
      <div style={{ margin: -8, marginLeft: 8 }}>
        {children}
      </div>
    </div>
  )
}