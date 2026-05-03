import { create } from 'zustand'

interface FilterLabelState {
  labels: Record<string, string>
  setLabel: (id: string, label: string) => void
  setLabels: (labelMap: Record<string, string>) => void
}

export const useFilterLabelStore = create<FilterLabelState>(set => ({
  labels: {},
  setLabel: (id, label) =>
    set(state => {
      if (state.labels[id] === label) return state
      return { labels: { ...state.labels, [id]: label } }
    }),
  setLabels: labelMap =>
    set(state => ({ labels: { ...state.labels, ...labelMap } })),
}))
