import '@testing-library/jest-dom/vitest';
import {SelectMock as Select} from './src/utils/testing';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: () => {
    return {
      getPropertyValue: () => {
        return undefined;
      },
    };
  },
});

vi.mock('antd', async () => {
  const antd = await vi.importActual('antd');

  return {...antd, Select};
});
