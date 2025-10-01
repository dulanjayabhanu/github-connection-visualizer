# Changelog

All notable changes to this project will be documented in this file.  
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.1] - 2025-10-01
### Fixed
- Corrected spelling in the data scanning progress indicator (`complete` → `completed`).
- Fixed issue where uploading a renamed backup file incorrectly showed a success message and caused console errors. Now displays a proper warning message.
- Fixed bug where modified backup files could be uploaded without showing the “Backup file decryption process failed” message. Application now blocks invalid files gracefully.
- Adjusted manifest and resource paths for deployment to ensure correct loading of icons and manifest data.
- Updated `What is this app?` section text for better clarity.

### Changed
- Updated progress bar behavior: animation now stops when progress reaches 100% to avoid confusion.
- Improved display labels for filter types to be more user-friendly:
  - **Unfollowers Only → Unfollowers**
  - **Mixed Results → Mixed Connections**
  - **Settled Results → Settled Connections**
  - **Fans Only → Fans**
- Added helper text to the passphrase input field to guide users on how to paste values (`Ctrl + V` / `Cmd + V`).
- Enhanced popover content in the filter section for better user guidance.

### Removed
- Deleted outdated software architecture diagram images (to be replaced with updated versions containing borders and shadows).

---

## [1.0.0] - 2025-09-30
### Added
- Initial stable release of **GitHub Connection Visualizer**.
- Core features:
  - GitHub data scanning with support for large-scale accounts.
  - Intelligent clustering into Unfollowers, Fans, and Settled Connections.
  - Data scanning monitor with progress tracking.
  - Encrypted backup and restore functionality.
  - User-friendly filtering and sorting mechanisms.
- Full documentation, including README, software architecture diagrams, and usage notes.
- Production-grade UI/UX with dark theme and glassmorphism effects.