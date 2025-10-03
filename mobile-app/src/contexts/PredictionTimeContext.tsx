import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface PredictionTimeContextType {
  predictionTime: Date;
  setPredictionTime: (time: Date) => void;
  isCurrentTime: boolean;
  timeOffset: number; // in hours
  resetToCurrentTime: () => void;
  formatPredictionTime: () => string;
  getTimeStatus: () => 'current' | 'future' | 'past';
}

const PredictionTimeContext = createContext<
  PredictionTimeContextType | undefined
>(undefined);

interface PredictionTimeProviderProps {
  children: ReactNode;
}

export const PredictionTimeProvider: React.FC<PredictionTimeProviderProps> = ({
  children,
}) => {
  const [predictionTime, setPredictionTimeState] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update current time every minute to keep calculations accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate time offset in hours (can be negative for past, positive for future)
  const calculateTimeOffset = (
    selectedTime: Date,
    referenceTime: Date,
  ): number => {
    const diffInMs = selectedTime.getTime() - referenceTime.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 10) / 10; // Round to 1 decimal place
  };

  const timeOffset = calculateTimeOffset(predictionTime, currentTime);

  // Consider "current time" if within 15 minutes
  const isCurrentTime = Math.abs(timeOffset) < 0.25; // 0.25 hours = 15 minutes

  const setPredictionTime = (time: Date) => {
    setPredictionTimeState(new Date(time)); // Create new Date object to ensure reactivity
  };

  const resetToCurrentTime = () => {
    setPredictionTime(new Date());
  };

  const getTimeStatus = (): 'current' | 'future' | 'past' => {
    if (isCurrentTime) return 'current';
    return timeOffset > 0 ? 'future' : 'past';
  };

  const formatPredictionTime = (): string => {
    const absOffset = Math.abs(timeOffset);

    if (isCurrentTime) {
      return 'Now';
    }

    if (absOffset < 1) {
      // Less than 1 hour - show in minutes
      const minutes = Math.round(absOffset * 60);
      const suffix = timeOffset > 0 ? 'from now' : 'ago';
      return `${minutes}m ${suffix}`;
    } else if (absOffset < 24) {
      // Less than 24 hours - show in hours
      const hours = Math.floor(absOffset);
      const minutes = Math.round((absOffset - hours) * 60);
      const suffix = timeOffset > 0 ? 'from now' : 'ago';

      if (minutes === 0) {
        return `${hours}h ${suffix}`;
      } else {
        return `${hours}h ${minutes}m ${suffix}`;
      }
    } else {
      // More than 24 hours - show in days
      const days = Math.floor(absOffset / 24);
      const remainingHours = Math.round(absOffset % 24);
      const suffix = timeOffset > 0 ? 'from now' : 'ago';

      if (remainingHours === 0) {
        return `${days}d ${suffix}`;
      } else {
        return `${days}d ${remainingHours}h ${suffix}`;
      }
    }
  };

  const formatAbsoluteTime = (): string => {
    const now = new Date();
    const isToday = predictionTime.toDateString() === now.toDateString();
    const isTomorrow =
      predictionTime.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    const isYesterday =
      predictionTime.toDateString() ===
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

    const timeString = predictionTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`;
    } else {
      return predictionTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
  };

  return (
    <PredictionTimeContext.Provider
      value={{
        predictionTime,
        setPredictionTime,
        isCurrentTime,
        timeOffset,
        resetToCurrentTime,
        formatPredictionTime,
        getTimeStatus,
      }}>
      {children}
    </PredictionTimeContext.Provider>
  );
};

export const usePredictionTime = (): PredictionTimeContextType => {
  const context = useContext(PredictionTimeContext);
  if (context === undefined) {
    throw new Error(
      'usePredictionTime must be used within a PredictionTimeProvider',
    );
  }
  return context;
};
