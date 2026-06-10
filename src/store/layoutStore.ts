export interface LayoutEditorState {
  isAdminMode: boolean
  selectedElement: string | null
}

export const initialLayoutEditorState: LayoutEditorState = {
  isAdminMode: false,
  selectedElement: null,
}
