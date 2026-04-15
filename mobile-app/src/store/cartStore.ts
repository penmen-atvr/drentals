import { create } from 'zustand';
import { Equipment } from '../types';
import { parseRate } from '../utils/pricing';

function diffDays(start: Date, end: Date) {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 0 ? 1 : diffDays;
}

export interface CartItem {
  equipment: Equipment;
  quantity: number;
  durationDays: number;
}

interface CartStore {
  items: CartItem[];
  startDate: Date;
  endDate: Date;
  setDates: (start: Date, end: Date) => void;
  addItem: (equipment: Equipment, quantity: number, durationDays: number) => void;
  removeItem: (equipmentId: number) => void;
  updateQuantity: (equipmentId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  startDate: new Date(),
  endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default 1 day duration
  
  setDates: (start, end) => set((state) => {
    // If user picks backwards end date, auto-adjust to 1 day minimum
    if (end < start) {
      end = new Date(start);
      end.setDate(start.getDate() + 1);
    }
    const globalDuration = diffDays(start, end);
    return {
      startDate: start,
      endDate: end,
      items: state.items.map(item => ({ ...item, durationDays: globalDuration }))
    };
  }),

  addItem: (equipment, quantity, durationDays) => {
    set((state) => {
      // Upon adding, immediately sync item to the global cart duration
      const globalDuration = diffDays(state.startDate, state.endDate);
      const existingItem = state.items.find(item => item.equipment.id === equipment.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.equipment.id === equipment.id
              ? { ...item, quantity: item.quantity + quantity, durationDays: globalDuration }
              : item
          )
        };
      }
      return { items: [...state.items, { equipment, quantity, durationDays: globalDuration }] };
    });
  },
  removeItem: (equipmentId) => {
    set((state) => ({
      items: state.items.filter(item => item.equipment.id !== equipmentId)
    }));
  },
  updateQuantity: (equipmentId, quantity) => {
    set((state) => ({
      items: state.items.map(item =>
        item.equipment.id === equipmentId ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const rate = parseRate(item.equipment.dailyRate);
      return total + (rate * item.quantity * item.durationDays);
    }, 0);
  }
}));
