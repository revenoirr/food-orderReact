import { expect } from 'vitest';
import '@testing-library/jest-dom';

// Ensure expect is available for jest-dom
(globalThis as any).expect = expect;