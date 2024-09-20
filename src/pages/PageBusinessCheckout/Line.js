import {
  Divider,
} from '@material-ui/core'

export default function Line({ children, divider }) {
  return (
    <>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 16,
        paddingBottom: 16
      }}>
        {children}
      </div>
      {divider && <Divider />}
    </>
  )
}