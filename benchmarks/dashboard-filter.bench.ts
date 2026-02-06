
import { performance } from 'perf_hooks';

// Simplified mock of FundApplication based on usage
interface FundApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  purpose: string;
}

const generateData = (count: number): FundApplication[] => {
  const data: FundApplication[] = [];
  const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];

  for (let i = 0; i < count; i++) {
    data.push({
      id: `app-${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 1000000),
      purpose: `Purpose ${i}`
    });
  }
  return data;
};

const runBenchmark = (iterations: number, listSize: number) => {
  const data = generateData(listSize);

  // Warmup
  for(let i=0; i<100; i++) {
     data.filter(app => app.status === 'pending');
  }

  const start = performance.now();
  let dummyCount = 0;

  for (let i = 0; i < iterations; i++) {
    // This is the operation we are optimizing away from the render loop
    const filtered = data.filter(app => app.status === 'pending');
    dummyCount += filtered.length;
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`Benchmark Results (check sum: ${dummyCount}):`);
  console.log(`List Size: ${listSize}`);
  console.log(`Iterations: ${iterations}`);
  console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average Time per Operation: ${avgTime.toFixed(4)}ms`);
  console.log(`Operations per Second: ${(1000 / avgTime).toFixed(2)}`);
};

console.log("--- Benchmarking Filter Operation ---");
// Scenario 1: Small list (current reality ~5-20 items)
runBenchmark(100000, 20);

// Scenario 2: Large list (potential future ~1000 items)
runBenchmark(10000, 1000);
