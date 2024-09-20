import DialogOnboarding from '../DialogOnboarding'

export default function Welcome({ skip }) {
  return (
    <DialogOnboarding
      title="Welcome to your Music Drive!"
      text={`This is where your entire career gets stored and organized. You can access it from either Faniak or a blue folder we've created in your Google Drive called "My Music Drive".`}
      buttonText="Continue"
      buttonOnClick={skip}
    />
  )
}