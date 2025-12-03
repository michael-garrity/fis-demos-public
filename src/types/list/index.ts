// Define a base interface that all records must adhere to.
export interface BaseListRecord {
  id: string;
  // All records must have an ID for keys and linking
}

// Props for the generic ListView component
export interface ListViewProps<T extends BaseListRecord> {
  // Array of records to display (e.g., Array<User> or Array<Product>)
  records: T[];
  title: string;

  // Href for the 'Create New' button (e.g., "/products/new")
  createNewRoute: string;

  // A component to handle how each individual record is rendered.
  // It receives the record data, edit link, and view link.
  RenderItem: React.FC<RenderItemProps<T>>;

  // Loading state to indicate if data is being fetched
  isLoading: boolean;
}

// Props passed to the custom component responsible for rendering a single item.
export interface RenderItemProps<T extends BaseListRecord> {
  record: T;
}
