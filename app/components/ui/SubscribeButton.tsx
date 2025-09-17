import { useEffect, useState } from "react";
import { authorizedRequest } from "~/configs";
import { HeartIcon } from "~/components/icons/HeartIcon";

interface SubscribeButtonProps {
  targetUsername: string;
  onSubscribeChange?: () => void;
}

export function SubscribeButton({ targetUsername, onSubscribeChange }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    authorizedRequest
      .get<{ subscribed: boolean }>(`/subscribe/subscribed/${targetUsername}`)
      .then((res) => {
        setIsSubscribed(res.data.subscribed);
      })
      .catch(() => {
        setIsSubscribed(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [targetUsername]);

  const handleToggle = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await authorizedRequest.post("/subscribe", { targetUsername });
      setIsSubscribed((prev) => !prev);
      onSubscribeChange?.();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const label = isSubscribed ? "Đã theo dõi" : "Theo dõi";

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        isSubscribed
          ? "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <HeartIcon className={`w-4 h-4 ${isSubscribed ? 'text-neutral-800' : 'text-white'}`} />
      <span>{isLoading ? "Đang tải..." : label}</span>
    </button>
  );
}

export default SubscribeButton;



