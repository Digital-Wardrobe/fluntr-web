import { useRouter } from 'next/router'
import DeepLinkLanding from '../../components/DeepLinkLanding'

export default function Page() {
  const { id } = useRouter().query
  return (
    <DeepLinkLanding
      kind="profile"
      id={id || ''}
      title="Fluntr profile"
      subtitle="View this wardrobe on Fluntr."
    />
  )
}
