type Procedure = (...args: any[]) => void;

export function debounce<F extends Procedure>(
  func: F,
  timeout: number = 300
): (...args: Parameters<F>) => void {
  let timer: NodeJS.Timeout | undefined;

  return function executedFunction(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timer);
      func(...args);
    };

    clearTimeout(timer);
    timer = setTimeout(later, timeout);
  };
}
