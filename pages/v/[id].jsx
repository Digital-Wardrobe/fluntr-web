import { useRouter } from 'next/router'
import DeepLinkLanding from '../../components/DeepLinkLanding'

export default function Page() {
  const { id } = useRouter().query
  return (
    <DeepLinkLanding
      kind="vibes"
      id={id || ''}
      title="Shared vibe"
      subtitle="Someone shared a vibe with you on Fluntr."
    />
  )
}
