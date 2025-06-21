import {describe, it, expect} from 'vitest';
import {simulateOccurences, generatePredictions} from '../controllers/transactions';

describe('simulateOccurences',()=>{
    it('generates daily recurrence within range',()=>{
        const recurring = {
        recurrence_type: 'daily',
        start_date: '2025-06-01T00:00:00Z',
        next_occurrence: null
        };

        const forecastStart = new Date('2025-06-01T00:00:00Z');
        const forecastEnd = new Date('2025-06-03T00:00:00Z');

        const result = simulateOccurences(recurring, forecastStart, forecastEnd);

        expect(result.length).toBe(3);
        expect(result[0].toISOString()).toBe('2025-06-01T00:00:00.000Z');
        expect(result[1].toISOString()).toBe('2025-06-02T00:00:00.000Z');
        expect(result[2].toISOString()).toBe('2025-06-03T00:00:00.000Z');
    });

    it('handles weekly recurrence correctly', () => {
        const recurring = {
            recurrence_type: 'weekly',
            start_date: '2025-06-01T00:00:00Z',
            next_occurrence: null
        };

        const forecastStart = new Date('2025-06-01T00:00:00Z');
        const forecastEnd = new Date('2025-06-15T00:00:00Z');

        const result = simulateOccurences(recurring, forecastStart, forecastEnd);

        expect(result.length).toBe(3);
        expect(result[0].toISOString()).toBe('2025-06-01T00:00:00.000Z');
        expect(result[1].toISOString()).toBe('2025-06-08T00:00:00.000Z');
        expect(result[2].toISOString()).toBe('2025-06-15T00:00:00.000Z');
    });

    it('handles custom hourly recurrence correctly', () => {
        const recurring = {
            recurrence_type: 'custom',
            custom_unit: 'hours',
            custom_interval: 2,
            start_date: '2025-06-01T00:00:00Z',
            next_occurrence: null
        };

        const forecastStart = new Date('2025-06-01T00:00:00Z');
        const forecastEnd = new Date('2025-06-01T06:00:00Z');

        const result = simulateOccurences(recurring, forecastStart, forecastEnd);

        expect(result.length).toBe(4); // 00:00, 02:00, 04:00, 06:00
        expect(result[0].toISOString()).toBe('2025-06-01T00:00:00.000Z');
        expect(result[1].toISOString()).toBe('2025-06-01T02:00:00.000Z');
        expect(result[2].toISOString()).toBe('2025-06-01T04:00:00.000Z');
        expect(result[3].toISOString()).toBe('2025-06-01T06:00:00.000Z');
    });

    it('handles custom daily recurrence correctly', () => {
        const recurring = {
            recurrence_type: 'custom',
            custom_unit: 'days',
            custom_interval: 3,
            start_date: '2025-06-01T00:00:00Z',
            next_occurrence: null
        };

        const forecastStart = new Date('2025-06-01T00:00:00Z');
        const forecastEnd = new Date('2025-06-10T00:00:00Z');

        const result = simulateOccurences(recurring, forecastStart, forecastEnd);

        expect(result.length).toBe(4); // 06-01, 06-04, 06-07, 06-10
        expect(result[0].toISOString()).toBe('2025-06-01T00:00:00.000Z');
        expect(result[1].toISOString()).toBe('2025-06-04T00:00:00.000Z');
        expect(result[2].toISOString()).toBe('2025-06-07T00:00:00.000Z');
        expect(result[3].toISOString()).toBe('2025-06-10T00:00:00.000Z');
    });

    it('handles monthly recurrence correctly', () => {
        const recurring = {
            recurrence_type: 'monthly',
            start_date: '2025-06-01T00:00:00Z',
            next_occurrence: null
        };

        const forecastStart = new Date('2025-06-01T00:00:00Z');
        const forecastEnd = new Date('2025-08-01T00:00:00Z');

        const result = simulateOccurences(recurring, forecastStart, forecastEnd);

        expect(result.length).toBe(3);
        expect(result[0].toISOString()).toBe('2025-06-01T00:00:00.000Z');
        expect(result[1].toISOString()).toBe('2025-07-01T00:00:00.000Z');
        expect(result[2].toISOString()).toBe('2025-08-01T00:00:00.000Z');
    });
    
})

describe('Hello World Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('generatePredictions', () => {
  const fromDate = new Date('2025-06-01T00:00:00Z');
  const tillDate = new Date('2025-08-31T23:59:59Z');
  it('should generate predictions with single monthly income', async () => {
    const recurringTransactions = [
      {
        type: 'income',
        amount: 1000,
        recurrence_type: 'monthly',
        start_date: '2025-06-01T00:00:00Z',
        next_occurrence: null,
      },
    ];

    const currentBalance = 5000;
    const dataPoints = await generatePredictions(recurringTransactions, currentBalance, fromDate, tillDate);

    expect(dataPoints.length).toBe(3); // June, July, August
    expect(dataPoints[0]).toEqual({
      date: '2025-06',
      income: 1000,
      expense: 0,
      balance: 6000, // 5000 + 1000
    });
    expect(dataPoints[1]).toEqual({
      date: '2025-07',
      income: 1000,
      expense: 0,
      balance: 7000, // 6000 + 1000
    });
    expect(dataPoints[2]).toEqual({
      date: '2025-08',
      income: 1000,
      expense: 0,
      balance: 8000, // 7000 + 1000
    });
  });

it('should handle expenses and income together', async () => {
    const recurringTransactions = [
      {
        type: 'income',
        amount: 2000,
        recurrence_type: 'monthly',
        start_date: '2025-06-01T00:00:00Z',
        next_occurrence: null,
      },
      {
        type: 'expense',
        amount: 500,
        recurrence_type: 'monthly',
        start_date: '2025-07-01T00:00:00Z',
        next_occurrence: null,
      },
    ];

    const currentBalance = 1000;
    const dataPoints = await generatePredictions(recurringTransactions, currentBalance, fromDate, tillDate);

    expect(dataPoints.length).toBe(3);

    expect(dataPoints[0]).toEqual({
      date: '2025-06',
      income: 2000,
      expense: 0,
      balance: 3000, // 1000 + 2000
    });

    expect(dataPoints[1]).toEqual({
      date: '2025-07',
      income: 2000,
      expense: 500,
      balance: 4500, // 3000 + 2000 - 500
    });

    expect(dataPoints[2]).toEqual({
      date: '2025-08',
      income: 2000,
      expense: 500,
      balance: 6000, // 4500 + 2000 - 500
    });
  });

  it('should handle no recurring transactions', async () => {
    const dataPoints = await generatePredictions([], 1000, fromDate, tillDate);
    expect(dataPoints).toEqual([]);
  });
});