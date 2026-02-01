import {type ReactElement} from 'react';
import {render, type RenderOptions} from '@testing-library/react';
import {Providers} from './Providers';

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: Providers, ...options});
