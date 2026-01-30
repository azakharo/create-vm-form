export interface HddDisk {
  name: string;
  enabled: boolean;
  size: number;
  diskInterface: 'SCSI' | 'SATA' | 'IDE' | 'VIRTIO';
}

export interface CreateVmFormValues {
  name: string;
  description: string;
  cpuCount: number;
  ramSize: number;
  chipset: 'q35' | 'i440';
  hddDisks: HddDisk[];
}
