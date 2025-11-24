// Define a base interface that all records must adhere to.
export interface BaseListRecord {
  id: string | number;
  // All records must have an ID for keys and linking
}

// Props for the generic ListView component
export interface ListViewProps<T extends BaseListRecord> {
  // Array of records to display (e.g., Array<User> or Array<Product>)
  records: T[];
  title: string;

  // Href for the 'Create New' button (e.g., "/products/new")
  createHref: string;

  // A component to handle how each individual record is rendered.
  // It receives the record data, edit link, and view link.
  RenderItem: React.FC<RenderItemProps<T>>;
}

// Props passed to the custom component responsible for rendering a single item.
export interface RenderItemProps<T extends BaseListRecord> {
  record: T;
  editHref: string;
  viewHref: string;
}
