import type { NextPage } from 'next'
import ProposalPreview from '../components/ProposalPreview'

const Preview: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Preview Proposal</h1>
      <ProposalPreview />
    </div>
  )
}

export default Preview
