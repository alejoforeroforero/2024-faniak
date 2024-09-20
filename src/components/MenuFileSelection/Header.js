import { IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

export default function Header({ currentFolder, setCurrentFolder }) {

  const handleGoBack = () => {
    setCurrentFolder(currentFolder.parents[0])
  }

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 12px 8px" }}>
      <IconButton
        size="small"
        onClick={handleGoBack}
        disabled={!currentFolder.parents}
      >
        <ArrowBackIcon />
      </IconButton>

      <div style={{ marginLeft: 8, alignItems: "center", fontWeight: 600, fontSize: 16, }}>
        {currentFolder.name}
      </div>
    </div>
  )
}