import { RootState } from '../store';

export const selectorAllOrders =
  (number: string | undefined) => (state: RootState) => {
    if (!number) return null;

    const num = Number(number);
    if (isNaN(num)) return null;

    if (state.orders.orders.length) {
      const data = state.orders.orders.find((i) => i.number === num);
      if (data) return data;
    }

    if (state.feed.orders.orders.length) {
      const data = state.feed.orders.orders.find((i) => i.number === num);
      if (data) return data;
    }

    if (state.order.orderByNumber?.number === num) {
      return state.order.orderByNumber;
    }

    return null;
  };
