export const ETHEscrowContract = "0x1bf0f4af65c6367b4d1d7e9b48287a3b9702c0cc";

export const ETHABI = {
  balanceOf: [
    {
      constant: true,
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  allowance: [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  approve: [
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
  escrow: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "createdBy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "OfferCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "offerAccepted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerCompleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "offerUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "decimals",
          type: "uint256",
        },
      ],
      name: "tokenAdded",
      type: "event",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "acceptOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "_tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "_decimals", type: "uint256" },
      ],
      name: "addToAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "allowedTokensList",
      outputs: [
        { internalType: "bool", name: "isAllowed", type: "bool" },
        { internalType: "string", name: "tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "decimals", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_offerId", type: "uint256" }],
      name: "cancelOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      name: "isAllowed",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "_sendAmount", type: "uint256" },
        { internalType: "uint256", name: "_receiveTokenId", type: "uint256" },
        { internalType: "uint256", name: "_receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "_minReceiveAmount", type: "uint256" },
      ],
      name: "makeOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "offerDetails",
      outputs: [
        { internalType: "uint256", name: "sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "sendAmount", type: "uint256" },
        { internalType: "uint256", name: "receiveTokenId", type: "uint256" },
        { internalType: "uint256", name: "receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "minReceiveAmount", type: "uint256" },
        { internalType: "address", name: "listerAddress", type: "address" },
        { internalType: "uint256", name: "status", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "removeFromAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_fee", type: "uint256" },
        { internalType: "address", name: "_feeWallet", type: "address" },
      ],
      name: "setFeeDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        { internalType: "uint256", name: "_receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "_minReceiveAmount", type: "uint256" },
      ],
      name: "updateOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
};

export const MATICEscrowContract = "0x0f57b17beC23c56A81EEE4AD185482E8D060e30A";

export const MATICABI = {
  balanceOf: [
    {
      constant: true,
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  allowance: [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  approve: [
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
  escrow: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "createdBy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "OfferCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "offerAccepted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerCompleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "offerUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "decimals",
          type: "uint256",
        },
      ],
      name: "tokenAdded",
      type: "event",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "acceptOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "_tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "_decimals", type: "uint256" },
      ],
      name: "addToAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "allowedTokensList",
      outputs: [
        { internalType: "bool", name: "isAllowed", type: "bool" },
        { internalType: "string", name: "tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "decimals", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_offerId", type: "uint256" }],
      name: "cancelOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      name: "isAllowed",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "_sendAmount", type: "uint256" },
        { internalType: "uint256", name: "_receiveTokenId", type: "uint256" },
        { internalType: "uint256", name: "_receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "_minReceiveAmount", type: "uint256" },
      ],
      name: "makeOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "offerDetails",
      outputs: [
        { internalType: "uint256", name: "sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "sendAmount", type: "uint256" },
        { internalType: "uint256", name: "receiveTokenId", type: "uint256" },
        { internalType: "uint256", name: "receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "minReceiveAmount", type: "uint256" },
        { internalType: "address", name: "listerAddress", type: "address" },
        { internalType: "uint256", name: "status", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "removeFromAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_fee", type: "uint256" },
        { internalType: "address", name: "_feeWallet", type: "address" },
      ],
      name: "setFeeDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        { internalType: "uint256", name: "_receiveAmount", type: "uint256" },
        { internalType: "uint256", name: "_minReceiveAmount", type: "uint256" },
      ],
      name: "updateOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
};

export const AVAXEscrowContract = "0x463384126084b8339E7240C070975584018649B1";

export const AVAXABI = {
  balanceOf: [
    {
      constant: true,
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  allowance: [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
  approve: [
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
  escrow: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "createdBy",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "sendAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveTokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "OfferCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "offerAccepted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerCompleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
      ],
      name: "offerRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "offerId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "receiveAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "offerUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "tokenName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "decimals",
          type: "uint256",
        },
      ],
      name: "tokenAdded",
      type: "event",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "acceptOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "_tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "_decimals", type: "uint256" },
      ],
      name: "addToAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "allowedTokensList",
      outputs: [
        { internalType: "bool", name: "isAllowed", type: "bool" },
        { internalType: "string", name: "tokenName", type: "string" },
        {
          internalType: "contract IERC20",
          name: "tokenAddress",
          type: "address",
        },
        { internalType: "uint256", name: "decimals", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_offerId", type: "uint256" }],
      name: "cancelOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
      name: "isAllowed",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "_sendAmount", type: "uint256" },
        {
          internalType: "uint256",
          name: "_receiveTokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_receiveAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "makeOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "offerDetails",
      outputs: [
        { internalType: "uint256", name: "sendTokenId", type: "uint256" },
        { internalType: "uint256", name: "sendAmount", type: "uint256" },
        {
          internalType: "uint256",
          name: "receiveTokenId",
          type: "uint256",
        },
        { internalType: "uint256", name: "receiveAmount", type: "uint256" },
        {
          internalType: "uint256",
          name: "minReceiveAmount",
          type: "uint256",
        },
        { internalType: "address", name: "listerAddress", type: "address" },
        { internalType: "uint256", name: "status", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
      name: "removeFromAllowList",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_fee", type: "uint256" },
        { internalType: "address", name: "_feeWallet", type: "address" },
      ],
      name: "setFeeDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_offerId", type: "uint256" },
        {
          internalType: "uint256",
          name: "_receiveAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_minReceiveAmount",
          type: "uint256",
        },
      ],
      name: "updateOffer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
};

export const SOLANAEscrowContract =
  "9xR3JArNqxMQrU5d9bjVTNuLGW6Y3w2XxBMHWRpjfkEi";

export type TokenExchange = {
  version: "0.1.0";
  name: "token_exchange";
  instructions: [
    {
      name: "initMainState";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "input";
          type: {
            defined: "MainStateInput";
          };
        }
      ];
    },
    {
      name: "updateMainState";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "input";
          type: {
            defined: "MainStateInput";
          };
        }
      ];
    },
    {
      name: "updateMainStateOwner";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "newOwner";
          type: "publicKey";
        }
      ];
    },
    {
      name: "allowToken";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "token";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mainState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "allowTokenStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "disallowToken";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "token";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mainState";
          isMut: false;
          isSigner: false;
        },
        {
          name: "allowTokenStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initOfferState";
      accounts: [
        {
          name: "offeror";
          isMut: true;
          isSigner: true;
        },
        {
          name: "offeredToken";
          isMut: false;
          isSigner: false;
        },
        {
          name: "requestedToken";
          isMut: false;
          isSigner: false;
        },
        {
          name: "offerStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccountAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offeredTokenAllowedChecker";
          isMut: true;
          isSigner: false;
        },
        {
          name: "requestedTokenAllowedChecker";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "initTime";
          type: "i64";
        }
      ];
    },
    {
      name: "createOffer";
      accounts: [
        {
          name: "offeror";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "offerorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccountAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offeredTokenAllowedChecker";
          isMut: true;
          isSigner: false;
        },
        {
          name: "requestedTokenAllowedChecker";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeReceiverAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "offeredAmount";
          type: "u64";
        },
        {
          name: "requestedAmount";
          type: "u64";
        },
        {
          name: "minRequestedAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "editOffer";
      accounts: [
        {
          name: "offeror";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "offerStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "input";
          type: {
            defined: "EditOfferInput";
          };
        }
      ];
    },
    {
      name: "acceptOffer";
      accounts: [
        {
          name: "acceptor";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "acceptorOfferedTokenAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "acceptorRequestedTokenAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerorRequestedTokenAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccountAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "feeReceiverAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "requestedAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "closeOffer";
      accounts: [
        {
          name: "offeror";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mainStateAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "offerStateAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "offerStateAccountAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "mainState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "feeReceiver";
            type: "publicKey";
          },
          {
            name: "feeRate";
            type: "f64";
          }
        ];
      };
    },
    {
      name: "allowedTokenState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "feature1";
            type: "f64";
          },
          {
            name: "isAllowed";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "offerState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "offeror";
            type: "publicKey";
          },
          {
            name: "offeredToken";
            type: "publicKey";
          },
          {
            name: "requestedToken";
            type: "publicKey";
          },
          {
            name: "offeredAmount";
            type: "u64";
          },
          {
            name: "requestedAmount";
            type: "u64";
          },
          {
            name: "minRequestedAmount";
            type: "u64";
          },
          {
            name: "initTime";
            type: "i64";
          },
          {
            name: "isActive";
            type: "bool";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "MainStateInput";
      type: {
        kind: "struct";
        fields: [
          {
            name: "feeReceiver";
            type: "publicKey";
          },
          {
            name: "feeRate";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "EditOfferInput";
      type: {
        kind: "struct";
        fields: [
          {
            name: "newRequestedTokenAmount";
            type: {
              option: "u64";
            };
          },
          {
            name: "newMinRequestedTokenAmount";
            type: {
              option: "u64";
            };
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "TokenAllowed";
      fields: [
        {
          name: "tokenId";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "TokenDisAllowed";
      fields: [
        {
          name: "tokenId";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "OfferCreated";
      fields: [
        {
          name: "offerId";
          type: "publicKey";
          index: false;
        },
        {
          name: "offeror";
          type: "publicKey";
          index: false;
        },
        {
          name: "offeredToken";
          type: "publicKey";
          index: false;
        },
        {
          name: "requestedToken";
          type: "publicKey";
          index: false;
        },
        {
          name: "offeredAmount";
          type: "u64";
          index: false;
        },
        {
          name: "requestedAmount";
          type: "u64";
          index: false;
        },
        {
          name: "minRequestedAmount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "OfferAccepted";
      fields: [
        {
          name: "offerId";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "OfferUpdated";
      fields: [
        {
          name: "offerId";
          type: "publicKey";
          index: false;
        },
        {
          name: "newRequestedTokenAmount";
          type: {
            option: "u64";
          };
          index: false;
        },
        {
          name: "newMinRequestedTokenAmount";
          type: {
            option: "u64";
          };
          index: false;
        }
      ];
    },
    {
      name: "OfferRevoked";
      fields: [
        {
          name: "offerId";
          type: "publicKey";
          index: false;
        }
      ];
    },
    {
      name: "OfferCompleted";
      fields: [
        {
          name: "offerId";
          type: "publicKey";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "OnlyOwnerCanCall";
      msg: "Only Owner can call";
    },
    {
      code: 6001;
      name: "TokenNotAllowed";
      msg: "Token not Allowed";
    },
    {
      code: 6002;
      name: "NotEnoughToken";
      msg: "You Do Not Have Enough Token to make Transaction";
    },
    {
      code: 6003;
      name: "ZeroOfferedAmount";
      msg: "Offered Token amount should not be Zero";
    },
    {
      code: 6004;
      name: "ZeroRequestedAmount";
      msg: "Requested Token amount should not be Zero";
    },
    {
      code: 6005;
      name: "TooLowAmount";
      msg: "Too low amount than min amount";
    },
    {
      code: 6006;
      name: "TooHighAmount";
      msg: "Too high amount than available amount";
    },
    {
      code: 6007;
      name: "OfferAlreadyCreated";
      msg: "Offer already created";
    },
    {
      code: 6008;
      name: "OfferNotActive";
      msg: "Offer is not Active now";
    },
    {
      code: 6009;
      name: "SelfOfferAccept";
      msg: "Self Offer accept not allowed";
    }
  ];
};

export const IDL: TokenExchange = {
  version: "0.1.0",
  name: "token_exchange",
  instructions: [
    {
      name: "initMainState",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "input",
          type: {
            defined: "MainStateInput",
          },
        },
      ],
    },
    {
      name: "updateMainState",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "input",
          type: {
            defined: "MainStateInput",
          },
        },
      ],
    },
    {
      name: "updateMainStateOwner",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "newOwner",
          type: "publicKey",
        },
      ],
    },
    {
      name: "allowToken",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "token",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mainState",
          isMut: false,
          isSigner: false,
        },
        {
          name: "allowTokenStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "disallowToken",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "token",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mainState",
          isMut: false,
          isSigner: false,
        },
        {
          name: "allowTokenStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initOfferState",
      accounts: [
        {
          name: "offeror",
          isMut: true,
          isSigner: true,
        },
        {
          name: "offeredToken",
          isMut: false,
          isSigner: false,
        },
        {
          name: "requestedToken",
          isMut: false,
          isSigner: false,
        },
        {
          name: "offerStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccountAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offeredTokenAllowedChecker",
          isMut: true,
          isSigner: false,
        },
        {
          name: "requestedTokenAllowedChecker",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "initTime",
          type: "i64",
        },
      ],
    },
    {
      name: "createOffer",
      accounts: [
        {
          name: "offeror",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "offerorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccountAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offeredTokenAllowedChecker",
          isMut: true,
          isSigner: false,
        },
        {
          name: "requestedTokenAllowedChecker",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeReceiverAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "offeredAmount",
          type: "u64",
        },
        {
          name: "requestedAmount",
          type: "u64",
        },
        {
          name: "minRequestedAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "editOffer",
      accounts: [
        {
          name: "offeror",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "offerStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "input",
          type: {
            defined: "EditOfferInput",
          },
        },
      ],
    },
    {
      name: "acceptOffer",
      accounts: [
        {
          name: "acceptor",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "acceptorOfferedTokenAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "acceptorRequestedTokenAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerorRequestedTokenAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccountAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "feeReceiverAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "requestedAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "closeOffer",
      accounts: [
        {
          name: "offeror",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mainStateAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "offerStateAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "offerStateAccountAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "mainState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "feeReceiver",
            type: "publicKey",
          },
          {
            name: "feeRate",
            type: "f64",
          },
        ],
      },
    },
    {
      name: "allowedTokenState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "feature1",
            type: "f64",
          },
          {
            name: "isAllowed",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "offerState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "offeror",
            type: "publicKey",
          },
          {
            name: "offeredToken",
            type: "publicKey",
          },
          {
            name: "requestedToken",
            type: "publicKey",
          },
          {
            name: "offeredAmount",
            type: "u64",
          },
          {
            name: "requestedAmount",
            type: "u64",
          },
          {
            name: "minRequestedAmount",
            type: "u64",
          },
          {
            name: "initTime",
            type: "i64",
          },
          {
            name: "isActive",
            type: "bool",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "MainStateInput",
      type: {
        kind: "struct",
        fields: [
          {
            name: "feeReceiver",
            type: "publicKey",
          },
          {
            name: "feeRate",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "EditOfferInput",
      type: {
        kind: "struct",
        fields: [
          {
            name: "newRequestedTokenAmount",
            type: {
              option: "u64",
            },
          },
          {
            name: "newMinRequestedTokenAmount",
            type: {
              option: "u64",
            },
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "TokenAllowed",
      fields: [
        {
          name: "tokenId",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "TokenDisAllowed",
      fields: [
        {
          name: "tokenId",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "OfferCreated",
      fields: [
        {
          name: "offerId",
          type: "publicKey",
          index: false,
        },
        {
          name: "offeror",
          type: "publicKey",
          index: false,
        },
        {
          name: "offeredToken",
          type: "publicKey",
          index: false,
        },
        {
          name: "requestedToken",
          type: "publicKey",
          index: false,
        },
        {
          name: "offeredAmount",
          type: "u64",
          index: false,
        },
        {
          name: "requestedAmount",
          type: "u64",
          index: false,
        },
        {
          name: "minRequestedAmount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "OfferAccepted",
      fields: [
        {
          name: "offerId",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "OfferUpdated",
      fields: [
        {
          name: "offerId",
          type: "publicKey",
          index: false,
        },
        {
          name: "newRequestedTokenAmount",
          type: {
            option: "u64",
          },
          index: false,
        },
        {
          name: "newMinRequestedTokenAmount",
          type: {
            option: "u64",
          },
          index: false,
        },
      ],
    },
    {
      name: "OfferRevoked",
      fields: [
        {
          name: "offerId",
          type: "publicKey",
          index: false,
        },
      ],
    },
    {
      name: "OfferCompleted",
      fields: [
        {
          name: "offerId",
          type: "publicKey",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "OnlyOwnerCanCall",
      msg: "Only Owner can call",
    },
    {
      code: 6001,
      name: "TokenNotAllowed",
      msg: "Token not Allowed",
    },
    {
      code: 6002,
      name: "NotEnoughToken",
      msg: "You Do Not Have Enough Token to make Transaction",
    },
    {
      code: 6003,
      name: "ZeroOfferedAmount",
      msg: "Offered Token amount should not be Zero",
    },
    {
      code: 6004,
      name: "ZeroRequestedAmount",
      msg: "Requested Token amount should not be Zero",
    },
    {
      code: 6005,
      name: "TooLowAmount",
      msg: "Too low amount than min amount",
    },
    {
      code: 6006,
      name: "TooHighAmount",
      msg: "Too high amount than available amount",
    },
    {
      code: 6007,
      name: "OfferAlreadyCreated",
      msg: "Offer already created",
    },
    {
      code: 6008,
      name: "OfferNotActive",
      msg: "Offer is not Active now",
    },
    {
      code: 6009,
      name: "SelfOfferAccept",
      msg: "Self Offer accept not allowed",
    },
  ],
};

export function getContract(network = "") {
  const _network = network.toLowerCase();

  switch (_network) {
    case "ethereum":
      return {
        address: ETHEscrowContract,
        abi: ETHABI.escrow,
        erc20Abi: [...ETHABI.balanceOf, ...ETHABI.allowance, ...ETHABI.approve],
      };

    case "polygon":
      return {
        address: MATICEscrowContract,
        abi: MATICABI.escrow,
        erc20Abi: [
          ...MATICABI.balanceOf,
          ...MATICABI.allowance,
          ...MATICABI.approve,
        ],
      };

    case "avalanche":
      return {
        address: AVAXEscrowContract,
        abi: AVAXABI.escrow,
        erc20Abi: [
          ...AVAXABI.balanceOf,
          ...AVAXABI.allowance,
          ...AVAXABI.approve,
        ],
      };

    case "solana":
      return {
        address: SOLANAEscrowContract,
        feeReceiver: "BnqWRLZz3sHhH3xxwv6nXKRr6AcotfMay7uDjD58J1Q3",
        IDL: IDL,
      };
    default:
      return {};
  }
}
