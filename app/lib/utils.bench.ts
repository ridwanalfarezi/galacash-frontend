import type { TransactionDisplay } from '~/types/domain';

import { groupTransactionsByDate } from './utils';

/**
 * Generate a random date string between two dates in YYYY-MM-DD format.
 *
 * @param start - The earliest date in the range
 * @param end - The latest date in the range
 * @returns A `YYYY-MM-DD` formatted string representing a date between `start` and `end`
 */
function getRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate large dataset
const COUNT = 10000;
const transactions: TransactionDisplay[] = [];
const startDate = new Date('2023-01-01');
const endDate = new Date('2023-12-31');

console.log('Generating ' + COUNT + ' transactions...');
for (let i = 0; i < COUNT; i++) {
  transactions.push({
    id: `t-${i}`,
    date: getRandomDate(startDate, endDate),
    description: `Transaction ${i}`,
    type: Math.random() > 0.5 ? 'income' : 'expense',
    amount: Math.floor(Math.random() * 1000000),
  });
}

console.log(`Running benchmark with ${COUNT} transactions...`);

const ITERATIONS = 100;
let totalTime = 0;

// Warmup
groupTransactionsByDate(transactions);

for (let i = 0; i < ITERATIONS; i++) {
  const start = performance.now();
  groupTransactionsByDate(transactions);
  const end = performance.now();
  totalTime += (end - start);
}

const averageTime = totalTime / ITERATIONS;
console.log(`Average execution time over ${ITERATIONS} runs: ${averageTime.toFixed(4)} ms`);