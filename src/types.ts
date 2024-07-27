export type VDOMAttributes = Record<
  string,
  string | number | boolean | Function | null
>;

export interface VDOMElement {
  kind: 'element';
  tagname: string;
  children?: VDomNode[];
  props?: VDOMAttributes;
  key: string | number;
}

export interface VDOMText {
  kind: 'text';
  value: string;
  key: string | number;
}

export type Component<P> = (props: P) => VDOMElement;

export interface VDOMComponent {
  kind: 'component';
  props: object;
  component: Component<any>;
  key: string;
}

export type VDomNode = VDOMElement | VDOMText | VDOMComponent;

export type AttributesUpdater = {
  set: VDOMAttributes;
  remove: string[];
};

export interface UpdateOperation {
  kind: 'update';
  attributes: AttributesUpdater;
  children: ChildUpdater[];
}

export interface ReplaceOperation {
  kind: 'replace';
  node: VDomNode;
}

export interface SkipOperation {
  kind: 'skip';
}

export type VDomNodeUpdater =
  | UpdateOperation
  | ReplaceOperation
  | SkipOperation;

export interface RemoveOperation {
  kind: 'remove';
}

export interface InsertOperation {
  kind: 'insert';
  node: VDomNode;
}

export type ChildUpdater =
  | InsertOperation
  | UpdateOperation
  | RemoveOperation
  | ReplaceOperation
  | SkipOperation;
