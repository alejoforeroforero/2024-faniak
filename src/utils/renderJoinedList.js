export default function renderJoinedList(list = []) {
  const separator = (index) => (
    <span key={`${index.toString()}-bullet`}> &#8226; </span>
  )
  const array = []

  list.forEach((label, index) => {
    array.push(
      <span key={index.toString()}>
        {label}
      </span>
    )
    if (index < list.length - 1) {
      array.push(separator(index))
    }
  })

  return array
}