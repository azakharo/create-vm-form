import '@testing-library/jest-dom/vitest';

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

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

globalThis.ResizeObserver =
  ResizeObserverMock as unknown as typeof ResizeObserver;

vi.mock('antd', async () => {
  const antd = await vi.importActual<typeof import('antd')>('antd');
  const {SelectMock} = await import('./src/utils/testing/SelectMock');

  return {...antd, Select: SelectMock};
});
