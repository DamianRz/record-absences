export interface TableHeader {
  name: string
  value: string
}

export interface TableProps {
  isLoading: boolean
  headers: TableHeader[]
  items: any[]
  className?: string
  footerButtons: any
  onSelectRow: any
}

export interface RowProps {
  value: object
  onSelect: any
  isSelected: boolean
}
