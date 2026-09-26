import { useRouter } from 'next/router'
import DeepLinkLanding from '../../components/DeepLinkLanding'

export default function Page() {
  const { id } = useRouter().query
  return (
    <DeepLinkLanding
      kind="post"
      id={id || ''}
      title="Shared look"
      subtitle="Someone shared a look with you on Fluntr."
    />
  )
}
