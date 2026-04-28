// HealthChain Smart Contract ABI
// Deploy this contract to Base Sepolia

export const HEALTHCHAIN_CONTRACT = {
  address: (import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  abi: [
    // createRecord(string ipfsHash, string recordType, uint256 timestamp) → recordId
    {
      type: 'function',
      name: 'createRecord',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'ipfsHash', type: 'string' },
        { name: 'recordType', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
      outputs: [{ name: 'recordId', type: 'uint256' }],
    },
    // grantAccess(uint256 recordId, address grantee, uint256 expiresAt)
    {
      type: 'function',
      name: 'grantAccess',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'recordId', type: 'uint256' },
        { name: 'grantee', type: 'address' },
        { name: 'expiresAt', type: 'uint256' },
      ],
      outputs: [],
    },
    // revokeAccess(uint256 recordId, address grantee)
    {
      type: 'function',
      name: 'revokeAccess',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'recordId', type: 'uint256' },
        { name: 'grantee', type: 'address' },
      ],
      outputs: [],
    },
    // hasAccess(uint256 recordId, address user) → bool
    {
      type: 'function',
      name: 'hasAccess',
      stateMutability: 'view',
      inputs: [
        { name: 'recordId', type: 'uint256' },
        { name: 'user', type: 'address' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
    // getRecord(uint256 recordId) → (uint256, address, string, string, uint256, bool)
    {
      type: 'function',
      name: 'getRecord',
      stateMutability: 'view',
      inputs: [{ name: 'recordId', type: 'uint256' }],
      outputs: [
        { name: 'id', type: 'uint256' },
        { name: 'patient', type: 'address' },
        { name: 'ipfsHash', type: 'string' },
        { name: 'recordType', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'isActive', type: 'bool' },
      ],
    },
    // getPatientRecords(address patient) → uint256[]
    {
      type: 'function',
      name: 'getPatientRecords',
      stateMutability: 'view',
      inputs: [{ name: 'patient', type: 'address' }],
      outputs: [{ name: '', type: 'uint256[]' }],
    },
    // deactivateRecord(uint256 recordId)
    {
      type: 'function',
      name: 'deactivateRecord',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'recordId', type: 'uint256' }],
      outputs: [],
    },
    // Events
    {
      type: 'event',
      name: 'RecordCreated',
      inputs: [
        { name: 'recordId', type: 'uint256', indexed: true },
        { name: 'patient', type: 'address', indexed: true },
        { name: 'ipfsHash', type: 'string' },
        { name: 'recordType', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    },
    {
      type: 'event',
      name: 'AccessGranted',
      inputs: [
        { name: 'recordId', type: 'uint256', indexed: true },
        { name: 'patient', type: 'address', indexed: true },
        { name: 'grantee', type: 'address', indexed: true },
        { name: 'expiresAt', type: 'uint256' },
      ],
    },
    {
      type: 'event',
      name: 'AccessRevoked',
      inputs: [
        { name: 'recordId', type: 'uint256', indexed: true },
        { name: 'patient', type: 'address', indexed: true },
        { name: 'grantee', type: 'address', indexed: true },
      ],
    },
  ] as const,
};

// USDC Contract on Base Sepolia
export const USDC_CONTRACT = {
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`,
  abi: [
    // balanceOf(address) → uint256
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }],
    },
    // approve(address spender, uint256 amount)
    {
      type: 'function',
      name: 'approve',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
    // transfer(address to, uint256 amount)
    {
      type: 'function',
      name: 'transfer',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [{ name: '', type: 'bool' }],
    },
    // allowance(address owner, address spender) → uint256
    {
      type: 'function',
      name: 'allowance',
      stateMutability: 'view',
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const,
};
