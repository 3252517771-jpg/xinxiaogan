import { initialLayoutEditorState } from '@/store/layoutStore'

export function useAdmin() {
  return { isAdminMode: initialLayoutEditorState.isAdminMode }
}
