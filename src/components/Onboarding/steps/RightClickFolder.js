import DialogOnboarding from '../DialogOnboarding'

export default function RightClickFolder({ skip }) {
  return (
    <DialogOnboarding
      title="Right click for your Smart Folder options"
      text={`Right click on a Smart Folder to share an Artist with your band, a song with your sound engineer or a gig with your road crew. Keep everyone up to date and share your workload with your team.`}
      buttonText="OK"
      buttonOnClick={skip}
    />
  )
}