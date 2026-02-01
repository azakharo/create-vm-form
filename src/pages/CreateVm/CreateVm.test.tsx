import {screen, waitFor, fireEvent} from '@testing-library/react';
import {CreateVmPage} from './index';
import {render} from '../../utils/testing';
import {describe, it, expect, vi} from 'vitest';
import {createVm} from '../../api';
import userEvent from '@testing-library/user-event';

// Mock the createVm function
vi.mock('../../api', () => ({
  createVm: vi.fn(),
}));

describe('CreateVmPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit form with correct values', async () => {
    render(<CreateVmPage />);

    // Fill the required "Name" field
    const nameInput = screen.getByPlaceholderText(
      /Введите имя виртуальной машины/i,
    );
    await waitFor(() => {
      fireEvent.change(nameInput, {target: {value: 'Test VM'}});
    });

    // Create 1 HDD disk by clicking the "+" button
    const addButton = screen.getByRole('button', {name: 'plus'});
    await waitFor(() => {
      fireEvent.click(addButton);
    });

    // Click the "Create" button
    const createButton = screen.getByRole('button', {name: /Создать/i});
    await waitFor(() => {
      fireEvent.click(createButton);
    });

    // Verify createVm is called once with correct values
    await waitFor(() => {
      expect(createVm).toHaveBeenCalledTimes(1);
    });

    const expectedValues = {
      name: 'Test VM',
      description: '',
      cpuCount: 1,
      ramSize: 4,
      chipset: 'q35',
      hddDisks: [
        {
          id: 'disk-1',
          name: 'disk-1',
          enabled: true,
          size: 128,
          diskInterface: 'SCSI',
        },
      ],
      bootOrder: ['disk-1'],
    };

    expect(createVm).toHaveBeenCalledWith(expectedValues);
  });

  it('should submit form with i440 chipset', async () => {
    render(<CreateVmPage />);

    // Fill the required "Name" field
    const nameInput = screen.getByPlaceholderText(
      /Введите имя виртуальной машины/i,
    );
    await waitFor(() => {
      fireEvent.change(nameInput, {target: {value: 'Test VM'}});
    });

    // Change the Chipset field value to i440
    const chipsetI440Option = await screen.findByText('i440');
    await userEvent.selectOptions(screen.getByLabelText('Chipset'), [
      chipsetI440Option,
    ]);

    // Create 1 HDD disk by clicking the "+" button
    const addButton = screen.getByRole('button', {name: 'plus'});
    await waitFor(() => {
      fireEvent.click(addButton);
    });

    // Click the "Create" button
    const createButton = screen.getByRole('button', {name: /Создать/i});
    await waitFor(() => {
      fireEvent.click(createButton);
    });

    // Verify createVm is called once with correct values
    await waitFor(() => {
      expect(createVm).toHaveBeenCalledTimes(1);
    });

    const expectedValues = {
      name: 'Test VM',
      description: '',
      cpuCount: 1,
      ramSize: 4,
      chipset: 'i440',
      hddDisks: [
        {
          id: 'disk-1',
          name: 'disk-1',
          enabled: true,
          size: 128,
          diskInterface: 'SCSI',
        },
      ],
      bootOrder: ['disk-1'],
    };

    expect(createVm).toHaveBeenCalledWith(expectedValues);
  });
});
