# Changelog

All notable changes to the American Cloud TypeScript SDK are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
See [`VERSIONING.md`](./VERSIONING.md) for how SDK versions relate to the API version.

## [Unreleased]

## [1.3.3] - 2026-07-27

### Added

- Port forwarding: optional `tierId` on rule creation — targets a specific VPC
  tier when the public IP is reserved in a VPC and the VM has interfaces in more
  than one tier. Otherwise the tier is inferred from the VM; ignored for IPs in
  an isolated network.

### Changed

- Deleting a VM now also deletes the network that was auto-created for it, once
  no other VMs remain on it, and releases that network's public IPs. A network
  you supply is never auto-deleted.

## [1.3.2] - 2026-06-17

### Added

- Database backup encryption: enable or disable encryption of a cluster's
  backups with a passphrase via `PATCH /databases/clusters/{id}/backups/config`
  (passphrase 12–256 printable-ASCII characters; AES-256-CFB). Backup
  configuration and backup-list responses now report encryption status
  (`enabled`, `algorithm`).

## [1.3.1] - 2026-06-05

### Added

- Typed `GatewayTimeoutError` (504): isolated-network and snapshot deletes now
  document their transient responses — `409` (the resource still has
  attachments releasing, e.g. a network's NICs or a snapshot's volume mid-
  modification) and `504` (deletion still in progress) — and both surface as
  typed errors. Both are retryable: retry the delete until it succeeds or the
  resource is gone (404).

## [1.3.0] - 2026-06-04

### Added

- VPC tier management: get, update (rename/description), restart, and delete a
  single network tier of a VPC (`/networks/vpc/{id}/tiers/{tierId}`). Tier
  objects — including the `tiers` array on a VPC detail — now carry `aclId`
  alongside `aclName`.
- Object storage unit create returns the created unit (`storageUnitId`,
  `createdAt`, `maxBuckets`) instead of a generic success acknowledgement; the
  returned `storageUnitId` is the identifier every other object-storage call
  takes.

### Changed

- **Breaking:** VM scale takes its parameters (`cpu`, `memoryMb`) in the JSON
  request body instead of query parameters — both integers ≥ 1, at least one
  required.
- **Breaking:** firewall, egress, and network ACL rule `startPort`/`endPort`
  are integers (1–65535) on create/update, matching the integer values
  already returned on read. They were previously strings.
- **Breaking:** object storage `maxBuckets` and `limitKb` are now a number or
  `null` (`null` means no limit); the previous `"unlimited"` string value is
  no longer returned.
- Isolated-network endpoints cover standalone networks only — VPC tiers are
  managed via the new tier endpoints and no longer appear in, or are
  addressable through, `/networks/isolated`. Isolated-network responses drop
  the tier-only `vpcId`/`vpcName`/`aclId`/`aclName` fields, and restart
  returns a plain success acknowledgement.
- VM `networkName`/`networkId`/`rootVolumeId` may be `null` while the VM is
  provisioning; `network` is optional on create (omit it to have an isolated
  network created automatically); the possible VM `status` values are now
  documented.
- Snapshot reads always include `type` (`DataDisk` or `RootDisk`).
- Isolated-network and VPC deletes wait for teardown completion and surface
  failures instead of reporting success on submission; the isolated-network
  delete response no longer carries an internal job identifier.

### Fixed

- Creating a snapshot of a volume that cannot be snapshotted returns a
  descriptive 400 instead of a 500; database backup operations on a deleted
  cluster return 404 instead of 500.

## [1.2.2] - 2026-06-02

### Added

- Initial public release of the American Cloud TypeScript SDK (`@americancloud/sdk`).
- Versioned in lockstep with the API platform: SDK `x.y.z` is generated from
  OpenAPI document `x.y.z`. Targets American Cloud API `v1`.
- Coverage for compute, block storage, snapshots, networking (VPC, isolated
  networks, ACLs, firewall, port-forwarding, load-balancer and egress rules),
  public IPs, DNS, managed databases, Kubernetes, object storage, and WordPress.

[Unreleased]: https://github.com/American-Cloud/americancloud-sdk-typescript/compare/v1.3.3...HEAD
[1.3.3]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.3
[1.3.2]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.2
[1.3.1]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.1
[1.3.0]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.0
[1.2.2]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.2.2
