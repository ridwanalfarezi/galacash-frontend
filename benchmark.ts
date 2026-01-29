import { groupTransactionsByDate } from './app/lib/utils';
import { toTransactionDisplayList, type Transaction } from './app/types/domain';

const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `t-${i}`,
      date: new Date(2024, 0, (i % 30) + 1).toISOString(),
      description: `Transaction ${i}`,
      type: (i % 2 === 0 ? 'income' : 'expense'),
      amount: (i + 1) * 1000,
    });
  }
  return transactions;
}

const runBenchmark = () => {
  const count = 5000;
  const transactions = generateTransactions(count);

  console.log(`Benchmarking with ${count} transactions...`);

  const start = performance.now();
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
      const filtered = toTransactionDisplayList(transactions);
      groupTransactionsByDate(filtered);
  }
  const end = performance.now();

  const totalTime = end - start;
  console.log(`Processed ${count} transactions ${iterations} times in ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${(totalTime / iterations).toFixed(4)}ms`);
}

runBenchmark();
