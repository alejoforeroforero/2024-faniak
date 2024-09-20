import { Box, Card } from '@material-ui/core'
import { creditTypes } from '../../../../utils/creditsUtils'
import PreviewSection from '../../PreviewSection'
import CreditsList from './CreditsList'
import Skeleton from '@material-ui/lab/Skeleton'

export default function DefaultCredits({ member, setMember }) {
  return (
    <PreviewSection text="Skill Set">
      <Card variant="outlined">
        {member ? (
          <Box pt={0.5} pb={0.5}>
            <CreditsList
              label="Musician"
              type={creditTypes.PLAYED}
              default_credits={member.default_credits}
              setMember={setMember}
            />
            <CreditsList
              label="Songwriter"
              type={creditTypes.WROTE}
              default_credits={member.default_credits}
              setMember={setMember}
            />
            <CreditsList
              label="Others"
              type={creditTypes.OTHERS}
              default_credits={member.default_credits}
              setMember={setMember}
            />
          </Box>
        ) : (
          <Skeleton variant="rect" height={64} />
        )}
      </Card>
    </PreviewSection>
  )
}