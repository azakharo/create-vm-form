import type {CreateVmFormValues} from '../pages/CreateVm/types';
import {sleep} from '../utils';

export const createVm = async (params: CreateVmFormValues): Promise<void> => {
  // simulate api request
  await sleep(1000);

  console.log('simulate request to api to create VM:', {params});
};
