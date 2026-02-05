// eslint-disable-next-line import/no-unresolved
import { describe, expect, it } from 'bun:test'

import { FinancialPieChart } from './FinancialPieChart'

describe('FinancialPieChart', () => {
  it('should be a memoized component', () => {
    // Check if the component is a Memo object
    // React.memo returns an object with $$typeof property set to REACT_MEMO_TYPE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isMemo = (FinancialPieChart as any).$$typeof === Symbol.for('react.memo')
    expect(isMemo).toBe(true)
  })
})
