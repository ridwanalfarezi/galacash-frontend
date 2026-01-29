import { formatCurrency } from '../app/lib/utils'

const runBenchmark = () => {
  const iterations = 100000
  const amounts = [1000, 50000, 123456.78, 999999999, 0]

  console.log(`Starting benchmark for formatCurrency with ${iterations} iterations...`)

  // Warmup
  for (let i = 0; i < 100; i++) {
    formatCurrency(amounts[i % amounts.length])
  }

  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    formatCurrency(amounts[i % amounts.length])
  }

  const end = performance.now()
  const duration = end - start
  const ops = (iterations / duration) * 1000

  console.log(`Total time: ${duration.toFixed(2)}ms`)
  console.log(`Operations per second: ${ops.toFixed(0)}`)
}

runBenchmark()
