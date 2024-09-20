import { Link } from '@material-ui/core'
import { CHROME_EXTENSION_URL } from '../../../store'
import DialogOnboarding from '../DialogOnboarding'

export default function MagicSync({ skip }) {
  return (
    <DialogOnboarding
      title="Send metadata to your distributor or Collective Rights Society instantly"
      text={<>
        Add your metadata to Faniak once and we'll make it ready for your Digital Distributor, Collective Rights Societies or other services you use, with one click. Install <Link
          href={CHROME_EXTENSION_URL}
          target="_blank"
          rel="noopener"
        >
          Faniak Magic Sync
        </Link> chrome extension (it's free!) and say goodbye to boring admin.
      </>}
      buttonText="Got it"
      buttonOnClick={skip}
    />
  )
}