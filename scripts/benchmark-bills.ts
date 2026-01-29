import { calculateTotalBills } from '../app/lib/calculations';
import type { components } from '../app/types/api';

type CashBill = components['schemas']['CashBill'];

const generateMockBills = (count: number): CashBill[] => {
  const bills: CashBill[] = [];
  for (let i = 0; i < count; i++) {
    bills.push({
      id: `bill-${i}`,
      totalAmount: Math.floor(Math.random() * 1000000),
      month: String((i % 12) + 1),
      year: 2024,
      status: 'belum_dibayar',
    });
  }
  return bills;
};

const runBenchmark = () => {
  const iterations = 100;
  const billsCount = 10000;
  console.log(`Generating ${billsCount} mock bills...`);
  const bills = generateMockBills(billsCount);

  console.log(`Running benchmark (${iterations} iterations)...`);
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    calculateTotalBills(bills);
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per iteration: ${avgTime.toFixed(4)}ms`);
};

runBenchmark();
