import {screen, waitFor, fireEvent} from '@testing-library/react';
import {CreateVmPage} from './index';
import {render} from '../../utils/testing';
import {describe, it, expect, vi} from 'vitest';
import {createVm} from '../../api';
import {userEvent} from '@testing-library/user-event';

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
    const chipsetSelect = await screen.findByLabelText('Chipset');
    await userEvent.selectOptions(chipsetSelect, [chipsetI440Option]);

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

  it('should render all form fields from Main Info section', () => {
    render(<CreateVmPage />);

    // Verify Name input field is present
    const nameInput = screen.getByPlaceholderText(
      /Введите имя виртуальной машины/i,
    );
    expect(nameInput).toBeInTheDocument();

    // Verify Description textarea is present
    const descriptionInput = screen.getByPlaceholderText(
      /Введите описание виртуальной машины/i,
    );
    expect(descriptionInput).toBeInTheDocument();

    // Verify CPU count input is present
    const cpuCountInput = screen.getByPlaceholderText(
      /Введите количество CPU/i,
    );
    expect(cpuCountInput).toBeInTheDocument();

    // Verify RAM size input is present
    const ramSizeInput = screen.getByPlaceholderText(/Введите объём RAM/i);
    expect(ramSizeInput).toBeInTheDocument();

    // Verify Chipset select is present
    const chipsetSelect = screen.getByLabelText('Chipset');
    expect(chipsetSelect).toBeInTheDocument();
  });

  it('should display validation error when Name field is empty on submit', async () => {
    render(<CreateVmPage />);

    // Create 1 HDD disk by clicking the "+" button
    const addButton = screen.getByRole('button', {name: 'plus'});
    await waitFor(() => {
      fireEvent.click(addButton);
    });

    // Click the "Create" button without filling the Name field
    const createButton = screen.getByRole('button', {name: /Создать/i});
    await waitFor(() => {
      fireEvent.click(createButton);
    });

    // Verify validation error is displayed for the Name field
    await waitFor(() => {
      const errorMessage = screen.getByText(
        /Пожалуйста, введите имя виртуальной машины/i,
      );
      expect(errorMessage).toBeInTheDocument();
    });

    // Verify createVm is not called due to validation error
    expect(createVm).not.toHaveBeenCalled();
  });

  it('should have q35 and i440 options in Chipset field', async () => {
    render(<CreateVmPage />);

    // Find the Chipset select
    const chipsetSelect = screen.getByLabelText('Chipset');
    expect(chipsetSelect).toBeInTheDocument();

    // Verify both options are available in the dropdown
    const q35Option = await screen.findByText('q35');
    const i440Option = await screen.findByText('i440');

    expect(q35Option).toBeInTheDocument();
    expect(i440Option).toBeInTheDocument();
  });
});
