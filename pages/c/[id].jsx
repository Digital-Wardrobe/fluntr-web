import { useRouter } from 'next/router'
import DeepLinkLanding from '../../components/DeepLinkLanding'

export default function Page() {
  const { id } = useRouter().query
  return (
    <DeepLinkLanding
      kind="collection"
      id={id || ''}
      title="Shared collection"
      subtitle="Someone shared a Fluntr collection with you."
    />
  )
}
