import { llmsFullTxt, sendText } from '../lib/llms'

export async function getServerSideProps({ res }) {
  sendText(res, llmsFullTxt())
  return { props: {} }
}
export default function LlmsFullTxt() { return null }
