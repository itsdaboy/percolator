import { WalletProviderWrapper } from "@/components/providers/WalletProvider";

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletProviderWrapper>{children}</WalletProviderWrapper>;
}
