import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { scrollSepolia } from "viem/chains";

const { chains, publicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === "development"
      ? [ scrollSepolia ]
      : [ scrollSepolia ]),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === scrollSepolia.id)
          return {
            http: scrollSepolia.rpcUrls.public.http[0],
          };

        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
