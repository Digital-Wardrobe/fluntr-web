import { llmsTxt, sendText } from '../lib/llms'

export async function getServerSideProps({ res }) {
  sendText(res, llmsTxt())
  return { props: {} }
}
export default function LlmsTxt() { return null }
