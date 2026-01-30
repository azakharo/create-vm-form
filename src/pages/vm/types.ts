export interface CreateVmFormValues {
  name: string;
  description: string;
  cpuCount: number;
  ramSize: number;
  chipset: 'q35' | 'i440';
}
