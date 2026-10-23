import { AssessmentScenario } from '@/types/runner';

export const fintechScenario: AssessmentScenario = {
  id: 'skillbridge-ts-001',
  title: 'FinTech Transaction Pipeline & Idempotency Sanitizer',
  targetRole: 'Senior TypeScript / Frontend Engineer',
  companyName: 'FinNova Pay (Series B Scaleup - Milano)',
  companyTier: 'Tier 1 FinTech Partner',
  difficulty: 'Senior',
  durationMinutes: 20,
  category: 'Clean Code & Resilient State Architecture',
  tags: ['TypeScript 5.x', 'Pure Functions', 'Idempotency', 'State Immutability', 'Money Precision'],
  summary:
    'Risolvi bug critici di arrotondamento valuta, mutazione di stato e duplicazione token in un motore di elaborazione pagamenti in tempo reale.',
  briefMarkdown: `
### Contesto Operativo
Durante le ore di picco di mercato, il motore di elaborazione dei pagamenti di **FinNova Pay** ha riscontrato anomalie ad alto impatto:
1. **Fluttuazioni da floating point:** Errori di centesimi nei conteggi IVA dovuti a calcoli IEEE 754 non normalizzati.
2. **Mutazione non autorizzata dell'array originale:** Alcuni filtri stavano alterando la cronologia transazioni invece di produrre nuove strutture immutabili.
3. **Mancata idempotenza:** Richieste con lo stesso \`idempotencyKey\` inoltrate entro 60 secondi venivano addebitate due volte.

### Il Tuo Obiettivo
Nel file **\`solution.ts\`**, implementa la classe \`TransactionPipeline\` rispettando il contratto definito in **\`transaction.types.ts\`**.
L'implementazione deve:
1. **Normalizzare i centesimi:** Gestire l'importo e la tariffa con precisione a 2 decimali (arrotondamento matematico standard a 2 cifre senza propagazione d'errore).
2. **Garantire l'immutabilit:** I metodi di filtraggio e arricchimento NON devono modificare gli oggetti transazione originali.
3. **Gestire l'Idempotenza:** Registrare e scartare transazioni duplicate con la medesima chiave se inviate entro il TTL configurato.
4. **Calcolare l'aggregato finanziario:** Restituire totale lordo, totale netto commissioni e totale IVA in un report strutturato.
  `,
  acceptanceCriteria: [
    'Tutti i 5 test unitari deterministici devono superare con esito positivo (PASS)',
    'Nessuna mutazione su oggetti in input (Garanzia di immutabilità funzionale)',
    'Arrotondamento valuta a due cifre decimali preciso senza float drift (es. 10.005 -> 10.01)',
    'Gestione cache idempotency con verifica temporale (TTL di 60.000 ms)',
    'Complessità temporale massima O(N log N) per batch processing'
  ],
  evaluationRubric: [
    {
      category: 'Unit Test Deterministic Pass Rate',
      weightPercentage: 50,
      description: 'Esecuzione dei test automatizzati in sandbox isolata senza eccezioni non gestite.'
    },
    {
      category: 'Purezza Funzionale & Immutabilità',
      weightPercentage: 20,
      description: 'Assenza di side-effects, deep clone o safe spread di strutture complesse.'
    },
    {
      category: 'Robustezza Edge Cases & Precisione Matematica',
      weightPercentage: 20,
      description: 'Gestione transazioni zero, valute miste e precisione aritmetica.'
    },
    {
      category: 'Codice Pulito & Tipizzazione TypeScript',
      weightPercentage: 10,
      description: 'Aderenza a standard idiomatici, tipi espliciti e modularità leggibile.'
    }
  ],
  files: [
    {
      id: 'solution',
      name: 'solution.ts',
      language: 'typescript',
      readOnly: false,
      content: `// SkillBridge Proof-of-Skill Practical Assessment
// Role: Senior TypeScript / Frontend Engineer
// Scenario: Transaction Pipeline & Idempotency Sanitizer

import { Transaction, PipelineReport, PipelineOptions } from './transaction.types';

export class TransactionPipeline {
  private seenKeys: Map<string, number> = new Map();
  private idempotencyTtlMs: number;

  constructor(options?: PipelineOptions) {
    this.idempotencyTtlMs = options?.idempotencyTtlMs ?? 60000;
  }

  /**
   * Arrotonda un numero a 2 cifre decimali evitando problemi di floating-point
   */
  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Filtra le transazioni rimuovendo i duplicati con idempotencyKey uguale
   * avvenuti entro il TTL (default 60 secondi).
   * IMPORTANTE: Deve restituire un nuovo array senza alterare l'originale.
   */
  public deduplicate(transactions: Transaction[], currentTime: number = Date.now()): Transaction[] {
    const result: Transaction[] = [];
    const localSeen = new Map(this.seenKeys);

    for (const tx of transactions) {
      const lastSeen = localSeen.get(tx.idempotencyKey);
      if (lastSeen !== undefined && (currentTime - lastSeen) <= this.idempotencyTtlMs) {
        // Duplicato rilevato: scarta la transazione
        continue;
      }
      localSeen.set(tx.idempotencyKey, tx.timestamp);
      result.push({ ...tx });
    }

    this.seenKeys = localSeen;
    return result;
  }

  /**
   * Applica le commissioni e l'IVA a ciascuna transazione in modo IMMUTABILE.
   * Regola fee: feePercentage (es. 2.5%) + feeFixed (es. 0.30€).
   * L'IVA (22%) si calcola ESCLUSIVAMENTE sulla commissione (fee), non sull'importo lordo.
   */
  public processFees(
    transactions: Transaction[],
    feePercentage: number = 0.025,
    feeFixed: number = 0.30,
    vatRate: number = 0.22
  ): Transaction[] {
    return transactions.map(tx => {
      // Calcola fee totale sulla transazione
      const rawFee = (tx.amount * feePercentage) + feeFixed;
      const feeAmount = this.roundMoney(rawFee);
      const vatAmount = this.roundMoney(feeAmount * vatRate);
      const netAmount = this.roundMoney(tx.amount - feeAmount - vatAmount);

      return {
        ...tx,
        feeAmount,
        vatAmount,
        netAmount,
        status: 'processed'
      };
    });
  }

  /**
   * Genera un report aggregato delle transazioni processate.
   */
  public generateReport(transactions: Transaction[]): PipelineReport {
    const count = transactions.length;
    let totalGross = 0;
    let totalFees = 0;
    let totalVat = 0;
    let totalNet = 0;

    for (const tx of transactions) {
      totalGross += tx.amount;
      totalFees += tx.feeAmount ?? 0;
      totalVat += tx.vatAmount ?? 0;
      totalNet += tx.netAmount ?? tx.amount;
    }

    return {
      totalTransactions: count,
      totalGross: this.roundMoney(totalGross),
      totalFees: this.roundMoney(totalFees),
      totalVat: this.roundMoney(totalVat),
      totalNet: this.roundMoney(totalNet),
      generatedAt: new Date().toISOString()
    };
  }
}
`
    },
    {
      id: 'types',
      name: 'transaction.types.ts',
      language: 'typescript',
      readOnly: true,
      content: `// [READ-ONLY DOMAIN SPECIFICATION]

export type Currency = 'EUR' | 'USD' | 'GBP';
export type TransactionStatus = 'pending' | 'processed' | 'rejected';

export interface Transaction {
  id: string;
  idempotencyKey: string;
  amount: number;
  currency: Currency;
  timestamp: number;
  status: TransactionStatus;
  feeAmount?: number;
  vatAmount?: number;
  netAmount?: number;
  metadata?: Record<string, unknown>;
}

export interface PipelineOptions {
  idempotencyTtlMs?: number;
}

export interface PipelineReport {
  totalTransactions: number;
  totalGross: number;
  totalFees: number;
  totalVat: number;
  totalNet: number;
  generatedAt: string;
}
`
    },
    {
      id: 'tests',
      name: 'pipeline.test.ts',
      language: 'typescript',
      readOnly: true,
      content: `// [TEST SUITE REFERENCE] - Eseguita in tempo reale dalla Sandbox di SkillBridge

describe('TransactionPipeline Test Suite', () => {
  it('1. Deduplicazione corretta con rispetto del TTL di idempotenza');
  it('2. Garanzia di immutabilità funzionale (nessuna alterazione degli input originali)');
  it('3. Calcolo accurato di commissioni e IVA senza drift di floating point');
  it('4. Aggregazione coerente del report finanziario finale');
  it('5. Gestione resiliente di transazioni con importo zero e boundary values');
});
`
    }
  ],
  testCases: [
    {
      id: 'test-1',
      name: 'Deduplicazione idempotente & rispetto TTL',
      description: 'Scarta le transazioni con lo stesso idempotencyKey entro 60s preservando quelle successive.',
      weight: 20,
      expectedBehavior: 'Dovrebbe scartare 1 transazione duplicata e accettare quella valida post-TTL.',
      testFnBody: `
        const pipeline = new PipelineClass({ idempotencyTtlMs: 60000 });
        const now = 1700000000000;
        const txs = [
          { id: '1', idempotencyKey: 'key-A', amount: 100, currency: 'EUR', timestamp: now, status: 'pending' },
          { id: '2', idempotencyKey: 'key-A', amount: 100, currency: 'EUR', timestamp: now + 5000, status: 'pending' }, // duplicate within TTL
          { id: '3', idempotencyKey: 'key-B', amount: 250, currency: 'EUR', timestamp: now + 10000, status: 'pending' },
          { id: '4', idempotencyKey: 'key-A', amount: 100, currency: 'EUR', timestamp: now + 70000, status: 'pending' }, // valid (post TTL)
        ];
        const res = pipeline.deduplicate(txs, now + 70000);
        assert(res.length === 3, 'Previste 3 transazioni uniche dopo deduplica, ottenute: ' + res.length);
        assert(res[0].id === '1' && res[1].id === '3' && res[2].id === '4', 'ID transazioni risultanti non conformi alla sequenza attesa.');
      `
    },
    {
      id: 'test-2',
      name: 'Immutabilità funzionale rigorosa',
      description: 'Verifica che nessun array o oggetto transazione originale venga mutato in-place.',
      weight: 15,
      expectedBehavior: 'L array di input e i suoi elementi mantengono le referenze e lo stato originale congelato.',
      testFnBody: `
        const pipeline = new PipelineClass();
        const originalTx = { id: 'orig-1', idempotencyKey: 'key-orig', amount: 200, currency: 'EUR', timestamp: 1700000000000, status: 'pending' };
        const inputList = [originalTx];
        Object.freeze(originalTx);
        Object.freeze(inputList);

        const processed = pipeline.processFees(inputList, 0.03, 0.50, 0.22);
        assert(processed !== inputList, 'La funzione deve restituire una nuova istanza di array, non il riferimento originale.');
        assert(processed[0] !== originalTx, 'Ciascuna transazione processata deve essere una nuova copia e non mutare l originale.');
        assert(originalTx.status === 'pending', 'Lo stato originale non deve essere mutato.');
        assert(processed[0].status === 'processed', 'Il nuovo record deve avere lo stato aggiornato.');
      `
    },
    {
      id: 'test-3',
      name: 'Calcolo commissioni e IVA senza floating-point drift',
      description: 'Accuratezza millimetrica su arrotondamenti con numeri critici (es. 99.99€, fee 2.5% + 0.30€).',
      weight: 20,
      expectedBehavior: 'feeAmount, vatAmount e netAmount conformi a calcoli con precisione a 2 decimali.',
      testFnBody: `
        const pipeline = new PipelineClass();
        const txs = [
          { id: 'tx-1', idempotencyKey: 'k-1', amount: 100, currency: 'EUR', timestamp: 1000, status: 'pending' },
          { id: 'tx-2', idempotencyKey: 'k-2', amount: 49.99, currency: 'EUR', timestamp: 2000, status: 'pending' }
        ];
        const res = pipeline.processFees(txs, 0.02, 0.50, 0.22);
        
        // Per 100€: rawFee = 2.00 + 0.50 = 2.50. VAT = 2.50 * 0.22 = 0.55. Net = 100 - 2.50 - 0.55 = 96.95
        assert(res[0].feeAmount === 2.50, 'Atteso feeAmount 2.50, ricevuto: ' + res[0].feeAmount);
        assert(res[0].vatAmount === 0.55, 'Atteso vatAmount 0.55, ricevuto: ' + res[0].vatAmount);
        assert(res[0].netAmount === 96.95, 'Atteso netAmount 96.95, ricevuto: ' + res[0].netAmount);

        // Per 49.99€: rawFee = 0.9998 + 0.50 = 1.4998 -> arrotondato a 1.50
        // VAT = 1.50 * 0.22 = 0.33. Net = 49.99 - 1.50 - 0.33 = 48.16
        assert(res[1].feeAmount === 1.50, 'Atteso feeAmount arrotondato 1.50, ricevuto: ' + res[1].feeAmount);
        assert(res[1].vatAmount === 0.33, 'Atteso vatAmount 0.33, ricevuto: ' + res[1].vatAmount);
        assert(res[1].netAmount === 48.16, 'Atteso netAmount 48.16, ricevuto: ' + res[1].netAmount);
      `
    },
    {
      id: 'test-4',
      name: 'Aggregazione report e quadratura contabile',
      description: 'Generazione del report complessivo con somma dei totali lordo, commissioni, IVA e netto.',
      weight: 10,
      expectedBehavior: 'Quadratura esatta del bilancio con totalNet = totalGross - totalFees - totalVat.',
      testFnBody: `
        const pipeline = new PipelineClass();
        const txs = [
          { id: '1', idempotencyKey: '1', amount: 100, currency: 'EUR', timestamp: 1, status: 'processed', feeAmount: 2.50, vatAmount: 0.55, netAmount: 96.95 },
          { id: '2', idempotencyKey: '2', amount: 200, currency: 'EUR', timestamp: 2, status: 'processed', feeAmount: 5.00, vatAmount: 1.10, netAmount: 193.90 }
        ];
        const rep = pipeline.generateReport(txs);
        assert(rep.totalTransactions === 2, 'Atteso 2 transazioni, ricevuto: ' + rep.totalTransactions);
        assert(rep.totalGross === 300.00, 'Atteso totalGross 300, ricevuto: ' + rep.totalGross);
        assert(rep.totalFees === 7.50, 'Atteso totalFees 7.50, ricevuto: ' + rep.totalFees);
        assert(rep.totalVat === 1.65, 'Atteso totalVat 1.65, ricevuto: ' + rep.totalVat);
        assert(rep.totalNet === 290.85, 'Atteso totalNet 290.85, ricevuto: ' + rep.totalNet);
      `
    },
    {
      id: 'test-5',
      name: 'Resilienza ad importi zero ed edge cases',
      description: 'Verifica il corretto comportamento con importo 0€ e assenza di parametri opzionali.',
      weight: 5,
      expectedBehavior: 'Gestione senza divisioni per zero o valori NaN/undefined.',
      testFnBody: `
        const pipeline = new PipelineClass();
        const txs = [
          { id: 'zero-1', idempotencyKey: 'z-1', amount: 0, currency: 'EUR', timestamp: 1000, status: 'pending' }
        ];
        const processed = pipeline.processFees(txs, 0.05, 0.00, 0.22);
        assert(processed[0].feeAmount === 0, 'Su importo zero con fixedFee 0 il feeAmount deve essere 0.');
        assert(processed[0].vatAmount === 0, 'IVA su 0 deve essere 0.');
        assert(processed[0].netAmount === 0, 'Netto su 0 deve essere 0.');
        assert(!isNaN(processed[0].netAmount), 'netAmount non deve essere NaN.');
      `
    }
  ]
};
