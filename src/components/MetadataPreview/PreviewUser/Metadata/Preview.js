import { useCallback, useMemo } from 'react';
import { useSnackbar } from 'notistack'
import FormPreview, { PreviewItem } from '../../../form/FormPreview'
import { Divider } from '@material-ui/core'
import { simplifyDate } from '../../../../utils/dateUtils'
import { getServiceLabel } from '../../../../dictionary/service';

export default function Preview({ metadata, handleEdit }) {
  const { enqueueSnackbar } = useSnackbar()

  const copy = useCallback((value) => {
    navigator.clipboard.writeText(value)
    enqueueSnackbar("Copied to clipboard!", { variant: "success" })
  }, [])

  const birthday = useMemo(() => {
    return simplifyDate(metadata.birthday)
  }, [metadata.birthday])

  const external_memberships = useMemo(() => {
    return Object
      .entries(metadata.external_memberships)
      .map(([name, id]) => ({ name, id }))
  }, [metadata.external_memberships])

  return (
    <FormPreview>
      <PreviewItem label="Artistic name" value={metadata.artistic_name} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Birthday" value={birthday} handleEdit={handleEdit} />
      <PreviewItem label="Phone" value={metadata.phone} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="Country" value={metadata.country} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Address" value={metadata.address} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="Postal code" value={metadata.postal_code} handleCopy={copy} handleEdit={handleEdit} />
      <Divider />
      <PreviewItem label="ISNI" value={metadata.isni} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="IPN" value={metadata.ipn} handleCopy={copy} handleEdit={handleEdit} />
      <PreviewItem label="IPI/CAE" value={metadata.ipi_cae_number} handleCopy={copy} handleEdit={handleEdit} />
      {external_memberships.map((membership, i) => (
        <PreviewItem label={getServiceLabel(membership.name) + " member"} value={membership.id} handleCopy={copy} key={i} handleEdit={handleEdit} />
      ))}
    </FormPreview>
  )
}