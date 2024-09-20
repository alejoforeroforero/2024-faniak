import { useState, useMemo } from 'react';
import DialogEdit from './DialogEdit'
import PreviewSection from '../../PreviewSection'
import { formParsers } from '../../../../utils/formUtils'
import Preview from './Preview'

export default function Metadata({ member, fetchMember }) {
  const [showDialog, setShowDialog] = useState(false)
  const handleOpenDialog = () => setShowDialog(true)
  const handleCloseDialog = () => setShowDialog(false)

  const metadata = useMemo(() => {
    const data = {
      artistic_name: formParsers.text(member.artistic_name),
      birthday: formParsers.date(member.birthday),
      phone: formParsers.text(member.phone),
      country: formParsers.text(member.country),
      address: formParsers.text(member.address),
      postal_code: formParsers.text(member.postal_code),
      isni: formParsers.text(member.isni),
      ipn: formParsers.text(member.ipn),
      ipi_cae_number: formParsers.text(member.ipi_cae_number),
      external_memberships: member.external_memberships,
    }

    return data
  }, [member])

  return (
    <PreviewSection text="Metadata">
      <Preview metadata={metadata} handleEdit={handleOpenDialog} />

      {showDialog && Boolean(member) && (
        <DialogEdit
          handleClose={handleCloseDialog}
          fetchMember={fetchMember}
          metadata={metadata}
        />
      )}
    </PreviewSection>
  )
}