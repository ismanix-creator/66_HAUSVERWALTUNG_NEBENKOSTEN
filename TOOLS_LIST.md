# Tools-Liste (Workspace)

Kurzübersicht aller verfügbaren Funktionen / MCP‑/Extension‑Capabilities im Workspace.

Inhaltsverzeichnis
- [Übersicht](#übersicht)
- [Datei- und Dateisystem‑Tools](#datei--und-dateisystem-tools)
- [Workspace / Editor / VSCode‑Hilfen](#workspace--editor--vscode‑hilfen)
- [Suche & Lesen](#suche--lesen)
- [Git / GitKraken / Repository](#git--gitkraken--repository)
- [MCP / Filesystem / Container Activators](#mcp--filesystem--container-activators)
- [Pylance / Python Tools](#pylance--python-tools)
- [Terminal, Tasks & Runner](#terminal-tasks--runner)
- [Testing & Notebooks](#testing--notebooks)
- [Sonstige / Hilfsfunktionen](#sonstige--hilfsfunktionen)

## Übersicht

Diese Datei fasst die im Agenten‑/Workspace‑Interface verfügbaren Tools zusammen und gruppiert sie für schnelle Orientierung.

## Datei- und Dateisystem‑Tools
- `read_file`
- `create_file`
- `create_directory`
- `mcp_filesystem_read_text_file`
- `mcp_filesystem_read_multiple_files`
- `mcp_filesystem_read_media_file`
- `mcp_filesystem_create_directory` (aktivierbar über `activate_directory_and_file_creation_tools`)
- `mcp_filesystem_write_file` (aktivierbar über `activate_directory_and_file_creation_tools`)
- `mcp_filesystem_edit_file`
- `mcp_filesystem_move_file`
- `mcp_filesystem_directory_tree`
- `mcp_filesystem_get_file_info`
- `mcp_filesystem_list_directory`
- `mcp_filesystem_list_directory_with_sizes`
- `mcp_filesystem_search_files`

## Workspace / Editor / VSCode‑Hilfen
- `get_vscode_api`
- `install_extension`
- `run_vscode_command`
- `create_new_workspace`
- `get_project_setup_info`
- `create_new_jupyter_notebook`

## Suche & Lesen
- `file_search`
- `grep_search`
- `semantic_search`
- `fetch_webpage`
- `open_simple_browser`
- `read_file` (siehe Datei-Tools)
- `copilot_getNotebookSummary`
- `get_search_view_results`

## Git / GitKraken / Repository
- `github_repo`
- `mcp_gitkraken_repository_get_file_content`
- `mcp_gitkraken_git_add_or_commit`
- `mcp_gitkraken_git_blame`
- `mcp_gitkraken_git_branch`
- `mcp_gitkraken_git_checkout`
- `mcp_gitkraken_git_log_or_diff`
- `mcp_gitkraken_git_push`
- `mcp_gitkraken_git_stash`
- `mcp_gitkraken_git_status`
- `mcp_gitkraken_git_worktree`
- `mcp_gitkraken_gitkraken_workspace_list`
- `mcp_gitkraken_issues_add_comment`
- `mcp_gitkraken_issues_assigned_to_me`
- `mcp_gitkraken_issues_get_detail`
- `mcp_gitkraken_pull_request_assigned_to_me`
- `mcp_gitkraken_pull_request_create`
- `mcp_gitkraken_pull_request_create_review`
- `mcp_gitkraken_pull_request_get_comments`
- `mcp_gitkraken_pull_request_get_detail`

## MCP / Filesystem / Container Activators
- `activate_directory_and_file_creation_tools` (schaltet `mcp_filesystem_*` Schreibfunktionen frei)
- `activate_file_and_directory_inspection_tools`
- `activate_file_reading_tools`
- `activate_container_management_tools`
- `activate_image_management_tools`
- `activate_container_inspection_and_logging_tools`
- `activate_listing_tools_for_containers_and_images`
- `mcp_copilot_conta_list_networks`
- `mcp_copilot_conta_prune`

## Pylance / Python Tools
- `configure_python_environment`
- `get_python_environment_details`
- `get_python_executable_details`
- `install_python_packages`
- `activate_python_code_validation_and_execution`
- `activate_import_analysis_and_dependency_management`
- `activate_python_environment_management`
- `mcp_pylance_mcp_s_pylanceDocuments`
- `mcp_pylance_mcp_s_pylanceInvokeRefactoring`
- `mcp_pylance_mcp_s_pylanceSyntaxErrors`
- `mcp_pylance_mcp_s_pylanceFileSyntaxErrors`
- `mcp_pylance_mcp_s_pylanceRunCodeSnippet`
- `mcp_pylance_mcp_s_pylanceSyntaxErrors` (zweifach in Interface; ein Eintrag reicht)

## Terminal, Tasks & Runner
- `run_in_terminal`
- `run_task`
- `create_and_run_task`
- `get_terminal_output`
- `terminal_last_command`
- `terminal_selection`
- `get_task_output`

## Testing & Notebooks
- `runTests`
- `test_failure`
- `run_notebook_cell`
- `edit_notebook_file`
- `copilot_getNotebookSummary` (siehe Suche & Lesen)

## Sonstige / Hilfsfunktionen
- `apply_patch` (Patch‑Editor zum Ändern von Dateien)
- `list_dir`
- `list_code_usages`
- `get_changed_files`
- `get_errors`
- `get_search_view_results` (siehe Suche & Lesen)

---

Hinweis
- Einige Aktivator‑Funktionen (`activate_*`) schalten Gruppen von Fähigkeiten frei; sie sind im Interface als eigene Funktionen sichtbar und ermöglichen zusätzliche `mcp_filesystem_*` oder Container‑Funktionen.
- Falls du möchtest, schreibe ich diese Datei ins Repo (erledigt) und kann sie committen. Soll ich einen Commit erzeugen?
