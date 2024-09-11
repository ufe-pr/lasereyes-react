import { ReactNode, createContext, useContext, useMemo } from "react";
import { initialContext } from "./constants";
import {
  Config,
  LaserEyesClient,
  MAINNET,
  createConfig,
  createStores,
} from "lasereyes-core";
import { useStore } from "@nanostores/react";
import { LaserEyesContextType } from "./types";

const LaserEyesContext = createContext<LaserEyesContextType>(initialContext);

export default function LaserEyesProvider({
  config,
  children,
}: {
  config?: Config;
  children: ReactNode | ReactNode[];
}) {
  const client = useMemo(() => {
    const c = new LaserEyesClient(
      createStores(),
      createConfig(config ?? { network: MAINNET })
    );
    return c;
  }, [config]);
  const {
    address,
    paymentAddress,
    publicKey,
    paymentPublicKey,
    accounts,
    balance,
    connected,
    hasProvider,
    isConnecting,
    isInitializing,
    provider,
  } = useStore(client.$store);
  const library = useStore(client.$library);
  const network = useStore(client.$network);

  return (
    <LaserEyesContext.Provider
      value={{
        paymentAddress,
        address,
        publicKey,
        paymentPublicKey,
        library,
        network,
        accounts,
        balance: Number(balance),
        connected,
        isConnecting,
        isInitializing,
        provider,
        hasLeather: hasProvider.leather ?? false,
        hasMagicEden: hasProvider["magic-eden"] ?? false,
        hasOkx: hasProvider.okx ?? false,
        hasOyl: hasProvider.oyl ?? false,
        hasPhantom: hasProvider.phantom ?? false,
        hasUnisat: hasProvider.unisat ?? false,
        hasWizz: hasProvider.wizz ?? false,
        hasXverse: hasProvider.xverse ?? false,
        connect: client.connect.bind(client),
        disconnect: client.disconnect.bind(client),
        getBalance: async () =>
          ((await client.getBalance.call(client)) ?? "").toString(),
        getInscriptions: async () =>
          (await client.getInscriptions.call(client)) ?? [],
        getNetwork: client.getNetwork.bind(client),
        getPublicKey: async () =>
          (await client.getPublicKey.call(client)) ?? "",
        pushPsbt: client.pushPsbt.bind(client),
        signMessage: async (message: string, toSignAddress?: string) =>
          (await client.signMessage.call(client, message, toSignAddress)) ?? "",
        requestAccounts: async () =>
          (await client.requestAccounts.call(client)) ?? [],
        sendBTC: async (to, amount) =>
          (await client.sendBTC.call(client, to, amount)) ?? "",
        signPsbt: async (psbt, finalize, broadcast) =>
          (await client.signPsbt.call(client, psbt, finalize, broadcast)) ?? {
            signedPsbtBase64: "",
            signedPsbtHex: "",
          },
        switchNetwork: async (network) => {
          await client.switchNetwork.call(client, network);
        },
      }}
    >
      {children}
    </LaserEyesContext.Provider>
  );
}

export const useLaserEyes = (): LaserEyesContextType => {
  return useContext(LaserEyesContext);
};
