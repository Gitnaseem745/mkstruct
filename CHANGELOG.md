# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-02

### Changed
- **Major version bump**: Clean production release
- Optimized codebase for performance and minimal footprint
- Streamlined README with concise, industry-standard examples
- Improved tree normalization algorithm for better performance
- Enhanced package metadata for better npm discoverability

### Removed
- Removed examples folder (examples now in README only)
- Removed RELEASE_NOTES.md (consolidated into CHANGELOG)
- Removed unnecessary test scripts from package.json

### Added
- Added .npmignore for cleaner npm packages
- Added repository, bugs, and homepage fields to package.json
- Added engines field to specify minimum Node.js version
- Added files field to explicitly define npm package contents

## [1.3.0] - 2025-10-25

### Added
- **New `-s, --structure <text>` flag**: Directly provide folder/file structure as a string argument
- Support for single-hyphen tree characters (`├─`, `└─`)
- Enhanced file detection for common files without extensions (Dockerfile, Makefile, etc.)
- Enhanced file detection for dotfiles (.gitignore, .env, etc.)
- Better handling of root-level folders in tree structures

### Changed
- Improved tree parsing algorithm for nested structures
- More flexible depth calculation

### Fixed
- Files without extensions correctly identified as files
- Dotfiles correctly identified as files

## [1.2.0] - Previous Release

### Features
- Support for flat format and ASCII tree format
- Dry-run mode (`--dry-run`)
- Force overwrite mode (`--force`)
- Read from stdin (`--stdin`)
- Verbose logging (`--verbose`)
- Security: Prevents writing outside current directory
- Cross-platform compatibility
