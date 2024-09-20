export default function FileInput({ inputRef, onChange, accept, multiple }) {
  const props = {}

  if (accept) {
    props.accept = accept
  }

  return (
    <div style={{
      width: 0,
      height: 0,
      overflow: "hidden",
    }}>
      <input
        ref={inputRef}
        type="file"
        onChange={onChange}
        {...props}
        multiple={multiple}
      />
    </div>
  )
}