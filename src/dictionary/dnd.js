export const dndTypes = {
  FILE: "file",
}

export const dndBuildFileItem = (file) => {
  return {
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    parents: file.parents,
    shortcutDetails: { ...file.shortcutDetails },
    folderId: file.smart_folder?.id ?? "",
    folderType: file.smart_folder?.type ?? "",
  }
}