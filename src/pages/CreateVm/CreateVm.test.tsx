import {screen} from '@testing-library/react';
import {CreateVmPage} from './index';
import {render} from '../../utils/testing';

test('renders correctly', () => {
  render(<CreateVmPage />);
  const element = screen.getByText(/Создание ВМ/i);
  expect(element).toBeInTheDocument();
});
